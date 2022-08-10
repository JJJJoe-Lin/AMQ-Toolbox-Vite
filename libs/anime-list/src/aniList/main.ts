import * as AnimeList from '../animeList/main';
import { AuthOptions, authoriationRequest } from '../utils/oauth2';
import { async_GM_xmlhttpRequest } from '../utils/requests';

interface AniListAccessToken {
    'token_type': 'Bearer';
    'expires_in': number;
    'access_token': string;
    'refresh_token': string;
};

interface AniListUser {
    id: number;
    name: string;
}

interface AniListEntry {
    id: number;
    user?: AniListUser;
    media: AnimeList.Entry;
}

interface GraphQLData {
    query: string;
    variables: Record<string, any>;
}

type AniListStatus = 'CURRENT' | 'COMPLETED' | 'PAUSED' | 'DROPPED' | 'PLANNING';
type AniListSeriesType = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC'
    | 'MANGA' | 'NOVEL' | 'ONE_SHOT';

const ToGlobalStatus: Record<AniListStatus, AnimeList.Status> = {
    'CURRENT': 'Watching',
    'COMPLETED': 'Completed',
    'PAUSED': 'On-Hold',
    'DROPPED': 'Dropped',
    'PLANNING': 'Plan to Watch',
};

const ToLocalStatus: Record<AnimeList.Status, AniListStatus> = {
    'Watching': 'CURRENT',
    'Completed': 'COMPLETED',
    'On-Hold': 'PAUSED',
    'Dropped': 'DROPPED',
    'Plan to Watch': 'PLANNING',
};

const ToGlobalSeriesType: Record<AniListSeriesType, AnimeList.SeriesType> = {
    'MANGA': 'Unknown',
    'MOVIE': 'Movie',
    'MUSIC': 'Music',
    'NOVEL': 'Unknown',
    'ONA': 'ONA',
    'ONE_SHOT': 'Unknown',
    'OVA': 'OVA',
    'SPECIAL': 'Special',
    'TV': 'TV',
    'TV_SHORT': 'TV',
};

export class AniListFactory extends AnimeList.AnimeListFactory {
    public getInstance(): AnimeList.AnimeList {
        return new AniList();
    }
}

export class AniList extends AnimeList.AnimeList {
    private user: AnimeList.User | null;
    private readonly clientID = '8357';
    private readonly clientSecret = 'H7r1aJRh6XEnTnGZdqhd7WJIVklt622sYeR53syl';
    private readonly authBaseURL = 'https://anilist.co/api/v2/oauth/authorize';
    private readonly tokenBaseURL = 'https://anilist.co/api/v2/oauth/token';
    private readonly redirectURL = 'https://animemusicquiz.com/amqToolbox/oauth2';

    constructor() {
        super();
        this.user = null;
    }

    public async login(opt: AuthOptions): Promise<null | Error> {
        if (opt.grantTypes !== 'Authorization Code') {
            return new Error('Not supported grant type');
        }
        if (!this.logined()) {
            const authReqParam = new URLSearchParams({
                response_type: 'code',
                client_id: this.clientID,
                redirect_uri: this.redirectURL,
            });
            const authCode = await authoriationRequest(`${this.authBaseURL}?${authReqParam.toString()}`);
            if (authCode instanceof Error) {
                return authCode;
            }
            // Authoriation Grant for MAL
            const clientAuth = window.btoa(`${this.clientID}:${this.clientSecret}`);
            const authGrantData = {
                client_id: this.clientID,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: this.redirectURL,
            };
            const authGrantResp = await async_GM_xmlhttpRequest({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                url: this.tokenBaseURL,
                data: JSON.stringify(authGrantData),
            });
            if (authGrantResp === null || authGrantResp.status !== 200) {
                if (authGrantResp !== null) {
                    console.log(authGrantResp);
                }
                return new Error(`Authoriation Grant failed`);
            }
            const token: AniListAccessToken = JSON.parse(authGrantResp.responseText);
            token.expires_in = Date.now() + ((token.expires_in - 86400) * 1000);
            GM_setValue('AniList_accessToken', token);
        }
        return null;
    }

    public async logout(): Promise<Error | null> {
        this.user = null;
        GM_deleteValue('AniList_accessToken');
        return null;
    }

    public logined(): boolean {
        const token: AniListAccessToken | undefined = GM_getValue('AniList_accessToken');
        if (token && Date.now() < token.expires_in) {
            return true;
        } else {
            return false;
        }
    }

    public async getMyInfo(): Promise<AnimeList.User | Error> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        if (this.user) {
            return this.user;
        } else {
            const user = await this.getUser();
            if (user instanceof Error) {
                return user;
            }
            this.user = {
                id: user.id,
                name: user.name,
            };
            return this.user;
        }
    }

    public async updateAnime(id: number, status: AnimeList.Status): Promise<Error | null> {
        return this.updateAnimes([{id: id, status: status}]);
    }

    public async deleteAnime(id: number): Promise<Error | null> {
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const entry = await this.getEntry(user.name, id);
        if (entry instanceof Error) {
            return entry;
        }
        return this.deleteEntries([entry.id]);
    }

    public async getList(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<AnimeList.Entry[] | Error> {
        const entries = await this.getEntries(user, statuses);
        if (entries instanceof Error) {
            return entries;
        }
        return entries.map(entry => entry.media);
    }

    public async importList(entries: AnimeList.Entry[], overwrite: boolean): Promise<Error | null> {
        if (overwrite) {
            const err = await this.deleteList();
            if (err) {
                return err;
            }
            console.log('[importList] delete all entries successfully');
        }
        const ids = await this.getIds(entries.map(entry => entry.malID));
        if (ids instanceof Error) {
            return ids;
        }
        console.log('[importList] get AniList IDs successfully', ids);
        const animes = entries.map((entry, idx) => {
            return {
                id: ids[idx],
                status: entry.status,
            };
        });
        return this.updateAnimes(animes);
    }

    public async deleteList(): Promise<Error | null> {
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        const entries = await this.getEntries({name: user.name},
            ['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching']);
        if (entries instanceof Error) {
            return entries;
        }
        console.log('[deleteList] get all entries successfully', entries);
        return this.deleteEntries(entries.map(entry => entry.id));
    }

    private async getUser(): Promise<AniListUser | Error> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const data: GraphQLData = {
            query: `mutation getUser {
                UpdateUser {
                    id
                    name
                }
            }`,
            variables: {},
        };
        const resp = await async_GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.access_token}`,
            },
            url: 'https://graphql.anilist.co',
            data: JSON.stringify(data),
        });
        if (resp === null || resp.status !== 200) {
            return new Error(`Query failed: ${data.query}`);
        }
        const user = JSON.parse(resp.responseText).data.UpdateUser;
        return {
            id: user.id,
            name: user.name,
        };
    }

    private async refreshToken(): Promise<AniListAccessToken | Error> {
        const oldToken: AniListAccessToken | undefined = GM_getValue('AniList_accessToken');
        if (oldToken === undefined) {
            return new Error('No token to refresh');
        }
        const data = {
            client_id: this.clientID,
            client_secret: this.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: oldToken.refresh_token,
        };
        const resp = await async_GM_xmlhttpRequest({
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            url: this.tokenBaseURL,
            data: JSON.stringify(data),
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error('Refresh token failed');
        }
        const newToken: AniListAccessToken = JSON.parse(resp.responseText);
        newToken.expires_in = Date.now() + ((newToken.expires_in - 86400) * 1000);
        GM_setValue('AniList_accessToken', newToken);
        return newToken;
    }

    private async getToken(): Promise<AniListAccessToken | Error> {
        const token: AniListAccessToken | undefined = GM_getValue('AniList_accessToken');
        if (token === undefined) {
            return new Error('Not logined');
        } else if (Date.now() > token.expires_in) {
            return this.refreshToken();
        } else {
            return token;
        }
    }

    private async getEntry(userName: string, animeId: number): Promise<AniListEntry | Error> {
        const data: GraphQLData = {
            query: `query getEntry ($mediaId: Int, $userName: String) {
                query: MediaList (userName: $userName, mediaId: $mediaId) {
                    id
                    status
                    media {
                        id
                        idMal
                        title {
                            romaji
                        }
                        format
                        episodes
                    }
                    user {
                        id
                        name
                    }
                }
            }`,
            variables: {
                userName: userName,
                mediaId: animeId,
            },
        };
        const resp = await async_GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            url: 'https://graphql.anilist.co',
            data: JSON.stringify(data),
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${data.query}`);
        }
        const entry = JSON.parse(resp.responseText).data.query;
        return {
            id: entry.id,
            media: {
                malID: entry.media.idMal,
                status: ToGlobalStatus[entry.status as AniListStatus],
                title: entry.media.title.romaji,
                type: ToGlobalSeriesType[entry.media.format as AniListSeriesType],
                updateOnImport: true,
                numEpisodes: entry.media.episodes,
            },
        };
    }

    private async getEntries(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<AniListEntry[] | Error> {
        const stats = statuses.map(stat => ToLocalStatus[stat]);
        let varStr: string;
        let paramStr: string;
        let variables: GraphQLData['variables'];
        if ('id' in user) {
            varStr = '($userId: Int, $statuses: [MediaListStatus])';
            paramStr = '(userId: $userId, type: ANIME, status_in: $statuses)';
            variables = {
                userId: user.id,
                statuses: stats,
            };
        } else {
            varStr = '($userName: String, $statuses: [MediaListStatus])';
            paramStr = '(userName: $userName, type: ANIME, status_in: $statuses)';
            variables = {
                userName: user.name,
                statuses: stats,
            };
        }
        const data: GraphQLData = {
            query: `query getList ${varStr} {
                query: MediaListCollection ${paramStr} {
                    lists {
                        entries {
                            id
                            status
                            media {
                                id
                                idMal
                                title {
                                    romaji
                                }
                                format
                                episodes
                            }
                        }
                    }
                    user {
                        id
                        name
                    }
                }
            }`,
            variables: variables,
        }
        const resp = await async_GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            url: 'https://graphql.anilist.co',
            data: JSON.stringify(data),
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${data.query}`);
        }
        const lists = JSON.parse(resp.responseText).data.query.lists;
        const ret: AniListEntry[] = [];
        for (let list of lists) {
            for (let entry of list.entries) {
                ret.push({
                    id: entry.id,
                    media: {
                        malID: entry.media.idMal,
                        status: ToGlobalStatus[entry.status as AniListStatus],
                        title: entry.media.title.romaji,
                        type: ToGlobalSeriesType[entry.media.format as AniListSeriesType],
                        updateOnImport: true,
                        numEpisodes: entry.media.episodes,
                    },
                });
            }
        }
        return ret;
    }

    private async updateAnimes(animes: {id: number, status: AnimeList.Status}[]): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const queryNumLimit = 250;
        const data: GraphQLData = {
            query: `mutation addAnimes {`,
            variables: {},
        }
        for (let [idx, anime] of animes.entries()) {
            data.query += `q${idx}: SaveMediaListEntry (mediaId: ${anime.id}, status: ${ToLocalStatus[anime.status]}) {
                id
            }`;
            if ((idx + 1) % queryNumLimit === 0 || idx === animes.length - 1) {
                data.query += `}`;
                const resp = await async_GM_xmlhttpRequest({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token.access_token}`,
                    },
                    url: 'https://graphql.anilist.co',
                    data: JSON.stringify(data),
                });
                if (resp === null || resp.status !== 200) {
                    console.log(resp);
                    return new Error(`Query failed: ${data.query}`);
                }
                data.query = `mutation addAnimes {`;
            }
        }
        return null;
    }

    private async deleteEntries(ids: number[]): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const queryNumLimit = 250;
        const data: GraphQLData = {
            query: `mutation delEntries {`,
            variables: {},
        }
        for (let [idx, id] of ids.entries()) {
            data.query += `q${idx}: DeleteMediaListEntry (id: ${id}) {
                deleted
            }`;
            if ((idx + 1) % queryNumLimit === 0 || idx === ids.length - 1) {
                data.query += `}`;
                const resp = await async_GM_xmlhttpRequest({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token.access_token}`,
                    },
                    url: 'https://graphql.anilist.co',
                    data: JSON.stringify(data),
                });
                if (resp === null || resp.status !== 200) {
                    console.log(resp);
                    return new Error(`Query failed: ${data.query}`);
                }
                // TODO: check deleted of response
                data.query = `mutation delEntries {`;
            }
        }
        return null;
    }

    private async getIds(malIds: number[]): Promise<number[] | Error> {
        const queryNumLimit = 250;
        const data: GraphQLData = {
            query: `query getMedium {`,
            variables: {}
        }
        const ret: number[] = [];
        for (let [idx, malId] of malIds.entries()) {
            data.query += `q${idx}: Media (idMal: ${malId}, type: ANIME) {
                id
            }`;
            if ((idx + 1) % queryNumLimit === 0 || idx === malIds.length - 1) {
                data.query += `}`;
                const resp = await async_GM_xmlhttpRequest({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    url: 'https://graphql.anilist.co',
                    data: JSON.stringify(data),
                });
                if (resp === null || resp.status !== 200) {
                    console.log(resp);
                    return new Error(`Query failed: ${data.query}`);
                }
                const medium: Record<string, any> = JSON.parse(resp.responseText).data;
                for (let [key, media] of Object.entries(medium)) {
                    const idx = parseInt(key.slice(1), 10);
                    ret[idx] = media.id;
                }
                data.query = `query getMedium {`;
            }
        }
        return ret;
    }
}