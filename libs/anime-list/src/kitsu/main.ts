import * as kitsuCore from 'kitsu-core';
import * as AnimeList from '../animeList/main';
import { AuthOptions } from '../utils/oauth2';
import { asyncWait, async_GM_xmlhttpRequest } from '../utils/requests';

type KitsuStatus = 'completed' | 'current' | 'dropped' | 'on_hold' | 'planned';
type KitsuSeriesType = 'TV' | 'OVA' | 'movie' | 'special' | 'ONA' | 'music';

interface KitsuAccessToken {
    'token_type': 'bearer';
    'created_at': number;
    'expires_in': number;
    'access_token': string;
    'refresh_token': string;
    'scope': 'public';
};

interface KitsuUser {
    id: string;
    name: string;
}

interface KitsuEntry {
    id: string;
    selfLink: string;
    media?: AnimeList.Entry;
}

const ToGlobalStatus: Record<KitsuStatus, AnimeList.Status> = {
    'completed': 'Completed',
    'current': 'Watching',
    'dropped': 'Dropped',
    'on_hold': 'On-Hold',
    'planned': 'Plan to Watch',
};

const ToLocalStatus: Record<AnimeList.Status, KitsuStatus> = {
    'Completed': 'completed',
    'Watching': 'current',
    'Dropped': 'dropped',
    'On-Hold': 'on_hold',
    'Plan to Watch': 'planned',
};

const ToGlobalSeriesType: Record<KitsuSeriesType, AnimeList.SeriesType> = {
    'TV': 'TV',
    'OVA': 'OVA',
    'movie': 'Movie',
    'special': 'Special',
    'ONA': 'ONA',
    'music': 'Music',
};

export class KitsuFactory extends AnimeList.AnimeListFactory {
    public getInstance(): AnimeList.AnimeList {
        return new Kitsu();
    }
}

export class Kitsu extends AnimeList.AnimeList {
    private readonly clientID = 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
    private readonly clientSecret = '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151';
    private readonly tokenBaseURL = 'https://kitsu.io/api/oauth/token';
    private readonly reqDelay = 10; // ms

    constructor() {
        super();
    }

    public async login(opt: AuthOptions): Promise<Error | null> {
        if (opt.grantTypes === 'Password' && opt.username !== undefined && opt.password !== undefined) {
            const authData = new URLSearchParams({
                grant_type: 'password',
                username: opt.username,
                password: encodeURIComponent(opt.password),
            });
            const resp = await async_GM_xmlhttpRequest({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                url: this.tokenBaseURL,
                data: authData.toString(),
            });
            if (resp === null || resp.status !== 200) {
                console.log(resp);
                return new Error('Password Grant failed');
            }
            const token: KitsuAccessToken = JSON.parse(resp.responseText);
            token.expires_in -= 86400;
            GM_setValue('Kitsu_accessToken', token);
        } else {
            return new Error('Not supported AuthOptions');
        }
        // Get user info
        const user = await this.getUser();
        if (user instanceof Error) {
            return user;
        }
        this.user = {
            id: parseInt(user.id, 10),
            name: user.name,
        };
        return null;
    }

    public logined(): boolean {
        if (this.user !== null && GM_getValue('Kitsu_accessToken') !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    public async logout(): Promise<Error | null> {
        this.user = null;
        GM_deleteValue('Kitsu_accessToken');
        return null;
    }

    public async updateAnime(id: number, status: AnimeList.Status): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        const entry = await this.getEntry({id: this.user!.id}, id);
        if (entry instanceof Error) {
            return entry;
        } else if (entry === null) {
            return this.addEntry(id, status);
        } else {
            return this.updateEntry(entry, status);
        }
    }

    public async deleteAnime(id: number): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        const entry = await this.getEntry({id: this.user!.id}, id);
        if (entry instanceof Error) {
            return entry;
        } else if (entry === null) {
            console.warn('[deleteAnime] No anime to be deleted');
            return null;
        } else {
            return this.deleteEntry(entry);
        }
    }

    public async getList(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<AnimeList.Entry[] | Error> {
        const entries = await this.getEntries(user, statuses);
        if (entries instanceof Error) {
            return entries;
        }
        const ret: AnimeList.Entry[] = [];
        for (let entry of entries) {
            if (entry.media) {
                ret.push(entry.media);
            }
        }
        return ret;
    }

    public async importList(entries: AnimeList.Entry[], overwrite: boolean): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        if (await this.getToken() === null) {
            return new Error('Invalid token');
        }
        if (overwrite) {
            const err = await this.deleteList();
            if (err) {
                return err;
            }
            console.log('[importList] delete all entries successfully');
        }
        // get exist entries
        const existEntries = await this.getEntries({id: this.user!.id},
            ['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching']);
        if (existEntries instanceof Error) {
            return existEntries;
        }
        console.log('[importList] get exist entries successfully', existEntries);
        // create importEntry tasks
        const tasks: Promise<Error | null>[] = [];
        for (let entry of entries) {
            await asyncWait(this.reqDelay);
            tasks.push(this.importEntry(existEntries, entry));
        }
        // do tasks, retry the task if it failed
        let retry = 3;
        while (retry--) {
            const errs = await Promise.all(tasks);
            let count = 0;
            for (let [idx, err] of errs.entries()) {
                if (err) {
                    console.warn(`[importList] Anime "${entries[idx].title}" import failed:`, err);
                    count++;
                    if (retry > 0) {
                        await asyncWait(this.reqDelay);
                        tasks[idx] = this.importEntry(existEntries, entries[idx]);
                    }
                }
            }
            if (count === 0) {
                console.log(`[importList] all animes are updated`);
                break;
            } else if (retry === 0) {
                return new Error(`${count} animes are not updated`);
            } else {
                console.log(`[importList] ${count} entries are not updated, retry...`);
            }
        }
        return null;
    }

    public async deleteList(): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        if (await this.getToken() === null) {
            return new Error('Invalid token');
        }
        let retry = 3;
        while (retry--) {
            const entries = await this.getEntries({id: this.user!.id},
                ['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching']);
            if (entries instanceof Error) {
                return entries;
            }
            console.log('[deleteList] get all entries successfully', entries);
            const count = entries.length;
            if (count === 0) {
                console.log(`[deleteList] all entries are deleted`);
                break;
            } else if (retry === 0) {
                return new Error(`Some ${count} entries are not deleted`);
            } else {
                console.log(`[deleteList] ${count} entries are ready to delete`);
            }
            const reqs: Promise<Error | null>[] = [];
            for (let entry of entries) {
                await asyncWait(this.reqDelay);
                reqs.push(this.deleteEntry(entry));
            }
            const errs = await Promise.all(reqs);
            for (let [idx, err] of errs.entries()) {
                if (err) {
                    if (entries[idx].media) {
                        console.warn(`Anime "${entries[idx].media!.title}" delete failed:`, err);
                    } else {
                        console.warn(`Entry ID "${entries[idx].id}" delete failed:`, err);
                    }
                }
            }
        }
        return null;
    }

    private async refreshToken(): Promise<KitsuAccessToken | Error> {
        const oldToken: KitsuAccessToken | undefined = GM_getValue('Kitsu_accessToken');
        if (oldToken === undefined) {
            return new Error('No token to refresh');
        }
        const data = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: oldToken.refresh_token,
        });
        const resp = await async_GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            url: this.tokenBaseURL,
            data: data.toString(),
        });
        if (resp === null || resp.status !== 200) {
            return new Error('Refresh token failed');
        }
        const newToken: KitsuAccessToken = JSON.parse(resp.responseText);
        newToken.expires_in -= 86400;
        GM_setValue('Kitsu_accessToken', newToken);
        return newToken;
    }

    private async getToken(): Promise<KitsuAccessToken | null> {
        const token: KitsuAccessToken | undefined = GM_getValue('Kitsu_accessToken');
        if (token === undefined) {
            return null;
        } else if (Date.now() > (token.created_at + token.expires_in) * 1000) {
            const result = await this.refreshToken();
            if (result instanceof Error) {
                console.error(result);
                return null;
            } else {
                return result;
            }
        } else {
            return token;
        }
    }

    private async getUser(userName?: string): Promise<KitsuUser | Error> {
        let query: string;
        let resp: Tampermonkey.Response<any> | null;
        const self = this.logined() ? this.user!.name : undefined;
        
        if (userName === self) {
            if (!this.logined() && GM_getValue('Kitsu_accessToken') === undefined) {
                // should not be here
                return new Error('No username and not logined');
            }
            // get logined user (need auth)
            const token = await this.getToken();
            if (token === null) {
                return new Error('Invalid token');
            }
            query = `https://kitsu.io/api/edge/users?` + kitsuCore.query({
                filter: {
                    self: true,
                },
            });
            resp = await async_GM_xmlhttpRequest({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Accept': 'application/vnd.api+json',
                    'Authorization': `Bearer ${token.access_token}`,
                },
                url: query,
            });
        } else {
            // get user from userName (no need auth)
            query = `https://kitsu.io/api/edge/users?` + kitsuCore.query({
                filter: {
                    name: userName,
                },
            });
            resp = await async_GM_xmlhttpRequest({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Accept': 'application/vnd.api+json',
                },
                url: query,
            });
        }
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        const user = JSON.parse(resp.responseText).data[0];
        return {
            id: user.id,
            name: user.attributes.name,
        };
    }

    private async getEntry(user: { id: number; } | { name: string; }, animeId: number)
    : Promise<KitsuEntry | null | Error> {
        // use auth user if logined (for adult content)
        let headers: any = {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        };
        if (this.logined()) {
            const token = await this.getToken();
            if (token !== null) {
                headers['Authorization'] = `Bearer ${token.access_token}`;
            }
        }
        // get user ID
        let userId: number;
        if ('id' in user) {
            userId = user.id;
        } else {
            const userInfo = await this.getUser(user.name);
            if (userInfo instanceof Error) {
                return userInfo;
            }
            userId = parseInt(userInfo.id, 10);
        }
        // query
        const query = `https://kitsu.io/api/edge/library-entries?` + kitsuCore.query({
            filter: {
                userId: userId,
                animeId: animeId,
            },
            include: 'anime,anime.mappings',
        });
        const resp = await async_GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            url: query,
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        const entries = kitsuCore.deserialise(JSON.parse(resp.responseText));
        // console.log('[getEntry] deserialised data:', entries);
        if (!entries) {
            return new Error(`[getEntry] Invalid response of ${query}: Can't deserialise`);
        } else if (!entries.data) {
            return new Error(`[getEntry] Invalid response of ${query}: No data in entries`);
        } else if (entries.data.length === 0) {
            return null;
        }
        const entry = entries.data[0];
        const kitsuEntry: KitsuEntry = {
            id: entry.id,
            selfLink: entry.links.self,
        }
        const anime = entry.anime.data;
        if (anime === undefined) {
            console.warn(`[getEntry] No anime data in entry`, entry);
            return kitsuEntry;
        }
        const mappings: any[] = anime.mappings.data;
        if (mappings === undefined) {
            console.warn(`[getEntry] No mappings data in entry`, entry);
            return kitsuEntry;
        }
        const malMapping = mappings.find(mapping => {
            return mapping.externalSite === 'myanimelist/anime';
        });
        if (malMapping === undefined) {
            console.warn(`[getEntry] No MAL mapping data in entry`, entry);
            return kitsuEntry;
        }
        kitsuEntry.media = {
            malID: parseInt(malMapping.externalId, 10),
            status: ToGlobalStatus[entry.status as KitsuStatus],
            title: anime.canonicalTitle,
            type: ToGlobalSeriesType[anime.subtype as KitsuSeriesType],
            updateOnImport: true,
            numEpisodes: anime.episodeCount,
        };
        return kitsuEntry;
    }

    private async getEntries(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<KitsuEntry[] | Error> {
        // use auth user if logined (for adult content)
        let headers: any = {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        };
        if (this.logined()) {
            const token = await this.getToken();
            if (token !== null) {
                headers['Authorization'] = `Bearer ${token.access_token}`;
            }
        }
        // get user ID
        let userId: number;
        if ('id' in user) {
            userId = user.id;
        } else {
            const userInfo = await this.getUser(user.name);
            if (userInfo instanceof Error) {
                return userInfo;
            }
            userId = parseInt(userInfo.id, 10);
        }
        // query
        const stat = statuses.map(status => ToLocalStatus[status]);
        let query = `https://kitsu.io/api/edge/library-entries?` + kitsuCore.query({
            filter: {
                userId: userId,
                status: stat.toString(),
            },
            include: 'anime,anime.mappings',
            page: {
                limit: 500,
            },
        });
        const ret: KitsuEntry[] = [];
        while (query) {
            const resp = await async_GM_xmlhttpRequest({
                method: 'GET',
                headers: headers,
                url: query,
            });
            if (resp === null || resp.status !== 200) {
                console.log(resp);
                return new Error(`Query failed: ${query}`);
            }
            const entries = kitsuCore.deserialise(JSON.parse(resp.responseText));
            // console.log('[getEntries] deserialised data:', entries);
            if (!entries) {
                return new Error(`[getEntries] Invalid response of ${query}: Can't deserialise`);
            } else if (!entries.data) {
                return new Error(`[getEntries] Invalid response of ${query}: No data in entries`);
            }
            for (let entry of entries.data as any[]) {
                const kitsuEntry: KitsuEntry = {
                    id: entry.id,
                    selfLink: entry.links.self,
                }
                const anime = entry.anime.data;
                if (anime === undefined) {
                    console.warn(`[getEntries] No anime data in entry`, entry);
                    ret.push(kitsuEntry);
                    continue;
                }
                const mappings: any[] = anime.mappings.data;
                if (mappings === undefined) {
                    console.warn(`[getEntries] No mappings data in entry`, entry);
                    ret.push(kitsuEntry);
                    continue;
                }
                const malMapping = mappings.find(mapping => {
                    return mapping.externalSite === 'myanimelist/anime';
                });
                if (malMapping === undefined) {
                    console.warn(`[getEntries] No MAL mapping data in entry`, entry);
                    ret.push(kitsuEntry);
                    continue;
                }
                kitsuEntry.media = {
                    malID: parseInt(malMapping.externalId, 10),
                    status: ToGlobalStatus[entry.status as KitsuStatus],
                    title: anime.canonicalTitle,
                    type: ToGlobalSeriesType[anime.subtype as KitsuSeriesType],
                    updateOnImport: true,
                    numEpisodes: anime.episodeCount,
                };
                ret.push(kitsuEntry);
            }
            query = entries.links.next;
        }
        return ret;
    }

    private async deleteEntry(entry: KitsuEntry): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        const token = await this.getToken();
        if (token === null) {
            return new Error('Invalid token');
        }
        const resp = await async_GM_xmlhttpRequest({
            method: 'DELETE' as any,
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${token.access_token}`,
            },
            url: entry.selfLink,
        });
        if (resp === null || resp.status !== 204) {
            console.log(resp);
            return new Error(`Delete query failed: ${entry.selfLink}`);
        }
        return null;
    }

    private async addEntry(animeId: number, status: AnimeList.Status): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        const token = await this.getToken();
        if (token === null) {
            return new Error('Invalid token');
        }
        const data = {
            user: {
                data: {
                    type: 'users',
                    id: this.user!.id,
                },
            },
            anime: {
                data: {
                    type: 'anime',
                    id: animeId,
                },
            },
            status: ToLocalStatus[status],
        }
        const resp = await async_GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${token.access_token}`,
            },
            url: `https://kitsu.io/api/edge/library-entries`,
            data: JSON.stringify(kitsuCore.serialise('libraryEntries', data)),
        });
        if (resp === null || resp.status !== 201) {
            console.log(resp);
            return new Error(`Update anime query failed: ${JSON.stringify(data)}`);
        }
        // console.log(`[addEntry] response:`, resp);
        return null;
    }

    private async updateEntry(entry: KitsuEntry, status: AnimeList.Status): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        const token = await this.getToken();
        if (token === null) {
            return new Error('Invalid token');
        }
        const data = {
            id: entry.id,
            status: ToLocalStatus[status],
        }
        const resp = await async_GM_xmlhttpRequest({
            method: 'PATCH' as any,
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${token.access_token}`,
            },
            // url: `https://kitsu.io/api/edge/library-entries/${id}`,
            url: entry.selfLink,
            data: JSON.stringify(kitsuCore.serialise('libraryEntries', data)),
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Update entry failed: ${JSON.stringify(data)}`);
        }
        // console.log(`[updateEntry] response:`, resp);
        return null;
    }

    private async importEntry(existEntries: KitsuEntry[], entry: AnimeList.Entry): Promise<Error | null> {
        const existEntry = existEntries.find(existEntry => {
            return existEntry.media && existEntry.media.malID === entry.malID;
        });
        
        if (existEntry && existEntry.media!.status !== entry.status && entry.updateOnImport) {
            // update entry
            return this.updateEntry(existEntry, entry.status);
        } else if (existEntry) {
            // keep entry
            return null;
        } else {
            // add entry
            const animeId = await this.getAnimeId(entry.malID);
            if (animeId === null) {
                return new Error(`No anime '${entry.title}' in Kitsu`);
            } else if (animeId instanceof Error) {
                return animeId;
            } else {
                return this.addEntry(animeId, entry.status);
            }
        }
    }

    private async getAnimeId(malId: number): Promise<number | null | Error> {
        const query = `https://kitsu.io/api/edge/mappings?` + kitsuCore.query({
            filter: {
                externalSite: 'myanimelist/anime',
                externalId: malId,
            },
            include: 'item',
        });
        const resp = await async_GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            url: query,
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        const mappings = kitsuCore.deserialise(JSON.parse(resp.responseText));
        if (!mappings) {
            return new Error(`Invalid response of ${query}: Can't deserialise`);
        } else if (!mappings.data) {
            console.warn(`No data in mappings of malId=${malId}`);
            return null;
        }
        let animeInfo: any = undefined;
        for (let mapping of mappings.data) {
            const info = mapping.item.data;
            if (info === undefined) {
                continue;
            } else if (info.type !== 'anime') {
                continue;
            } else {
                animeInfo = info;
                break;
            }
        }
        if (animeInfo === undefined) {
            console.warn(`[getAnimeId] No anime info of malId=${malId}`);
            return null;
        }
        return parseInt(animeInfo.id, 10);
    }
}