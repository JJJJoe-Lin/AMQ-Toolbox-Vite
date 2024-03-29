import { GM_setValue, GM_getValue, GM_deleteValue } from '$';
import * as kitsuCore from 'kitsu-core';
import * as AnimeList from '../animeList/main';
import { AuthOptions } from '../utils/oauth2';
import { asyncWait, async_GM_xmlhttpRequest, TResponse } from '../utils/requests';

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

export class KitsuFactory implements AnimeList.AnimeListFactory {
    public getInstance(): AnimeList.AnimeList {
        return new Kitsu();
    }
}

export class Kitsu implements AnimeList.AnimeList {
    private user: AnimeList.User | null;
    private readonly clientID = 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
    private readonly clientSecret = '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151';
    private readonly tokenBaseURL = 'https://kitsu.io/api/oauth/token';
    private readonly reqDelay = 10; // ms

    constructor() {
        this.user = null;
    }

    public async login(opt: AuthOptions): Promise<Error | null> {
        if (opt.grantTypes !== 'Password' || opt.username === undefined || opt.password === undefined) {
            return new Error('Not supported AuthOptions');
        }
        if (!this.logined()) {
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
                console.error(`Password Grant failed, login data: ${authData}`, resp);
                return new Error('Password Grant failed');
            }
            const token: KitsuAccessToken = JSON.parse(resp.responseText);
            token.expires_in -= 86400;
            GM_setValue('Kitsu_accessToken', token);
        }
        return null;
    }

    public logined(): boolean {
        const token: KitsuAccessToken | undefined = GM_getValue('Kitsu_accessToken');
        if (token && Date.now() < (token.created_at + token.expires_in) * 1000) {
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

    public async getMyInfo(): Promise<AnimeList.User | Error> {
        if (this.user) {
            return this.user;
        } else {
            const user = await this.getUser();
            if (user instanceof Error) {
                return user;
            }
            this.user = {
                id: parseInt(user.id, 10),
                name: user.name,
            };
            return this.user;
        }
    }

    public async updateAnime(id: number, status: AnimeList.Status): Promise<Error | null> {
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const entry = await this.getEntry({id: user.id}, id);
        if (entry instanceof Error) {
            return entry;
        } else if (entry === null) {
            return this.addEntry(id, status);
        } else {
            return this.updateEntry(entry, status);
        }
    }

    public async deleteAnime(id: number): Promise<Error | null> {
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const entry = await this.getEntry({id: user.id}, id);
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
        if (overwrite) {
            console.log('[importList] overwrite enable, delete all entries');
            const err = await this.deleteList(['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching']);
            if (err) {
                return err;
            }
        }
        // get exist entries
        console.log('[importList] get exist entries of all status');
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const existEntries = await this.getEntries({id: user.id},
            ['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching']);
            if (existEntries instanceof Error) {
                return existEntries;
            }
        // create importEntry tasks
        console.log('[importList] import entries to list', existEntries);
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
                console.warn(`[importList] ${count} entries are not updated`);
                return new Error(`${count} entries are not updated`);
            } else {
                console.log(`[importList] ${count} entries are not updated, retry...`);
            }
        }
        return null;
    }

    public async deleteList(statuses: AnimeList.Status[]): Promise<Error | null> {
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        // do tasks, retry the task if it failed
        let retry = 3;
        while (retry--) {
            // get exist entries
            console.log(`[deleteList] get ${statuses} entries`);
            const entries = await this.getEntries({id: user.id}, statuses);
            if (entries instanceof Error) {
                return entries;
            }
            // delete entires from list
            console.log(`[deleteList] delete entries form list`, entries);
            let count = 0;
            const reqs: Promise<Error | null>[] = [];
            for (let entry of entries) {
                await asyncWait(this.reqDelay);
                reqs.push(this.deleteEntry(entry));
            }
            const errs = await Promise.all(reqs);
            for (let [idx, err] of errs.entries()) {
                if (err) {
                    count++;
                    if (entries[idx].media) {
                        console.warn(`[deleteList] Anime "${entries[idx].media!.title}" delete failed:`, err);
                    } else {
                        console.warn(`[deleteList] Entry ID "${entries[idx].id}" delete failed:`, err);
                    }
                }
            }

            if (count === 0) {
                console.log(`[deleteList] all entries are deleted`);
                break;
            } else if (retry === 0) {
                return new Error(`${count} entries are not deleted`);
            } else {
                console.log(`[deleteList] ${count} entries are not deleted, retry...`);
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

    private async getToken(): Promise<KitsuAccessToken | Error> {
        const token: KitsuAccessToken | undefined = GM_getValue('Kitsu_accessToken');
        if (token === undefined) {
            return new Error('Not logined');
        } else if (Date.now() > (token.created_at + token.expires_in) * 1000) {
            return this.refreshToken();
        } else {
            return token;
        }
    }

    private async getUser(userName?: string): Promise<KitsuUser | Error> {
        let query: string;
        let resp: TResponse<object> | null;
        if (userName === undefined || this.logined()) {
            const token = await this.getToken();
            if (token instanceof Error) {
                return token;
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
            console.error(`Get user failed, query: ${query}`, resp);
            return new Error(`Query failed: Get user`);
        }
        const user = JSON.parse(resp.responseText).data[0];
        return {
            id: user.id,
            name: user.attributes.name,
        };
    }

    private handleEntriesResp(resp: TResponse<object> | null): KitsuEntry[] | Error {
        let ret: KitsuEntry[] = [];
        if (resp === null || resp.status !== 200) {
            return new Error(`Query failed: Get `);
        }
        const entries = kitsuCore.deserialise(JSON.parse(resp.responseText));
        if (!entries) {
            return new Error(`Invalid query response: Can't deserialise `);
        } else if (!entries.data) {
            return new Error(`Invalid query response of query: No data in `);
        }
        for (let entry of entries.data as any[]) {
            const kitsuEntry: KitsuEntry = {
                id: entry.id,
                selfLink: entry.links.self,
            }
            const anime = entry.anime.data;
            if (anime === undefined) {
                console.warn(`[handleEntry] No anime data in entry`, entry);
                ret.push(kitsuEntry);   // no media in this entry
                continue;
            }
            let mappings: any[] = anime.mappings.data;
            if (mappings === undefined) {
                console.warn(`[handleEntry] No mappings data in entry`, entry);
                mappings = [];
            }
            let malID: number;
            const malMapping = mappings.find(mapping => {
                return mapping.externalSite === 'myanimelist/anime';
            });
            if (malMapping === undefined) {
                console.warn(`[handleEntry] No MAL mapping data in entry`, entry);
                malID = 0; // invalid MAL animeID 
            } else {
                malID = parseInt(malMapping.externalId, 10);
            }
            kitsuEntry.media = {
                malID: malID,
                status: ToGlobalStatus[entry.status as KitsuStatus],
                title: anime.canonicalTitle,
                type: ToGlobalSeriesType[anime.subtype as KitsuSeriesType],
                updateOnImport: true,
                numEpisodes: anime.episodeCount,
            };
            ret.push(kitsuEntry);
        }
        return ret;
    }

    private async getEntry(user: { id: number; } | { name: string; }, animeId: number)
    : Promise<KitsuEntry | null | Error> {
        // use auth user if logined (for adult content)
        let headers: any = {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        };
        const token = await this.getToken();
        if (!(token instanceof Error)) {
            headers['Authorization'] = `Bearer ${token.access_token}`;
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
        // handle response
        const kitsuEntry = this.handleEntriesResp(resp);
        if (kitsuEntry instanceof Error) {
            kitsuEntry.message += `user ${userId}'s entry`;
            console.error(`${kitsuEntry.message}, query: ${query}`, resp);
            return kitsuEntry;
        }
        if (kitsuEntry.length == 0) {
            return null;
        } else if (kitsuEntry.length != 1) {
            console.warn(`[getEntry] There are more than 1 result for ${query}`);
        }
        return kitsuEntry[0];
    }

    private async getEntries(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<KitsuEntry[] | Error> {
        // use auth user if logined (for adult content)
        let headers: any = {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        };
        const token = await this.getToken();
        if (!(token instanceof Error)) {
            headers['Authorization'] = `Bearer ${token.access_token}`;
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
                kind: 'anime',
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
            const kitsuEntries = this.handleEntriesResp(resp);
            if (kitsuEntries instanceof Error) {
                kitsuEntries.message += `user ${userId}'s entries`;
                console.error(`${kitsuEntries.message}, query: ${query}`, resp);
                return kitsuEntries;
            } else {
                ret.push(...kitsuEntries);
            }
            const entries = kitsuCore.deserialise(JSON.parse(resp!.responseText));
            query = entries.links.next;
        }
        return ret;
    }

    private async deleteEntry(entry: KitsuEntry): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
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
            console.error(`Failed query: ${entry.selfLink}`, resp);
            return new Error(`Query failed: Delete entry (animeID: ${entry.id})`);
        }
        return null;
    }

    private async addEntry(animeId: number, status: AnimeList.Status): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const data = {
            user: {
                data: {
                    type: 'users',
                    id: user.id,
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
            console.error(`Add entry (animeID: ${animeId}) failed, query data: ${JSON.stringify(data)}`, resp);
            return new Error(`Query failed: Add entry (animeID: ${animeId})`);
        }
        // console.log(`[addEntry] response:`, resp);
        return null;
    }

    private async updateEntry(entry: KitsuEntry, status: AnimeList.Status): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
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
            url: entry.selfLink,
            data: JSON.stringify(kitsuCore.serialise('libraryEntries', data)),
        });
        if (resp === null || resp.status !== 200) {
            console.error(`Update entry (animeID: ${entry.id}) failed, query data: ${JSON.stringify(data)}`, resp);
            return new Error(`Query failed: Update entry (animeID: ${entry.id})`);
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
                return new Error(`No anime '${entry.title}' (MAL ID: ${entry.malID}) in Kitsu`);
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
            console.error(`Get anime ID from MAL ID (${malId}) failed, query: ${query}`, resp);
            return new Error(`Query failed: Get anime ID from MAL ID (${malId})`);
        }
        const mappings = kitsuCore.deserialise(JSON.parse(resp.responseText));
        if (!mappings) {
            console.error(`Get anime ID from MAL ID (${malId}) failed, can't deserialise response of ${query}`, resp);
            return new Error(`Get anime ID from MAL ID (${malId}) failed, can't deserialise response`);
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