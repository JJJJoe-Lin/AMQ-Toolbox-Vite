import * as AnimeList from '../animeList/main';
import { AuthOptions, authoriationRequest } from '../utils/oauth2';
import { async_GM_xmlhttpRequest, asyncWait } from '../utils/requests';


type MyAnimeListStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
type MyAnimeListSeriesType = 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';

interface MyAnimeListAccessToken {
    'token_type': 'Bearer';
    'expires_in': number;
    'access_token': string;
    'refresh_token': string;
};

interface MyAnimeListUser {
    id: number;
    name: string;
}

const ToGlobalStatus: Record<MyAnimeListStatus, AnimeList.Status> = {
    'watching': 'Watching',
    'completed': 'Completed',
    'on_hold': 'On-Hold',
    'dropped': 'Dropped',
    'plan_to_watch': 'Plan to Watch',
};

const ToLocalStatus: Record<AnimeList.Status, MyAnimeListStatus> = {
    'Watching': 'watching',
    'Completed': 'completed',
    'On-Hold': 'on_hold',
    'Dropped': 'dropped',
    'Plan to Watch': 'plan_to_watch',
};

const ToGlobalSeriesType: Record<MyAnimeListSeriesType, AnimeList.SeriesType> = {
    'unknown': 'Unknown',
    'tv': 'TV',
    'ova': 'OVA',
    'movie': 'Movie',
    'special': 'Special',
    'ona': 'ONA',
    'music': 'Music',
};

export class MyAnimeListFactory extends AnimeList.AnimeListFactory {
    public getInstance(): AnimeList.AnimeList {
        return new MyAnimeList();
    }
}

export class MyAnimeList extends AnimeList.AnimeList {
    private user: AnimeList.User | null;
    private readonly PKCECode: string;
    private readonly PKCEMethod = 'plain';
    private readonly clientID = '9c9b61db4efa44f989cf3dea37bff94d';
    private readonly clientSecret = 'c6593a0dbbe8eb2ee8e15b59a62e04fe35989c6d2f11ce18aa1e108660e2aac2';
    private readonly authBaseURL = 'https://myanimelist.net/v1/oauth2/authorize';
    private readonly tokenBaseURL = 'https://myanimelist.net/v1/oauth2/token';
    private readonly redirectURL = 'https://animemusicquiz.com/amqToolbox/oauth2';
    private readonly reqDelay = 10; // ms

    constructor() {
        super();
        this.user = null;
        // PKCE code should be 48 characters
        this.PKCECode = window.btoa(Math.random().toFixed(16).toString()) +
            window.btoa(Math.random().toFixed(16).toString());
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
                code_challenge: this.PKCECode,
                code_challenge_method: this.PKCEMethod,
            });
            const authCode = await authoriationRequest(`${this.authBaseURL}?${authReqParam.toString()}`);
            if (authCode instanceof Error) {
                return authCode;
            }
            // Authoriation Grant for MAL
            const clientAuth = window.btoa(`${this.clientID}:${this.clientSecret}`);
            const authGrantData = new URLSearchParams({
                client_id: this.clientID,
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: this.redirectURL,
                code_verifier: this.PKCECode,
            });
            const authGrantResp = await async_GM_xmlhttpRequest({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${clientAuth}`,
                },
                url: this.tokenBaseURL,
                data: authGrantData.toString(),
            });
            if (authGrantResp === null || authGrantResp.status !== 200) {
                console.log(authGrantResp);
                return new Error('Authoriation Grant failed');
            }
            const token: MyAnimeListAccessToken = JSON.parse(authGrantResp.responseText);
            token.expires_in = Date.now() + ((token.expires_in - 86400) * 1000);
            GM_setValue('MyAnimeList_accessToken', token);
        }
        return null;
    }

    public async logout(): Promise<Error | null> {
        this.user = null;
        GM_deleteValue('MyAnimeList_accessToken');
        return null;
    }

    public logined(): boolean {
        const token: MyAnimeListAccessToken | undefined = GM_getValue('MyAnimeList_accessToken');
        if (token && Date.now() < token.expires_in) {
            return true;
        } else {
            return false;
        }
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
                id: user.id,
                name: user.name,
            };
            return this.user;
        }
    }

    public async updateAnime(id: number, status: AnimeList.Status): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const query = `https://api.myanimelist.net/v2/anime/${id}/my_list_status`;
        const data = new URLSearchParams({
            status: ToLocalStatus[status],
        });
        const resp = await async_GM_xmlhttpRequest({
            method: 'PATCH' as any,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token.access_token}`,
            },
            url: query,
            data: data.toString(),
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        return null;
    }

    public async deleteAnime(id: number): Promise<Error | null> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const query = `https://api.myanimelist.net/v2/anime/${id}/my_list_status`;
        const resp = await async_GM_xmlhttpRequest({
            method: "DELETE" as any,
            headers: {
                "Authorization": `Bearer ${token.access_token}`,
            },
            url: query,
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        return null;
    }

    public async getList(user: { id: number; } | { name: string; }, statuses: AnimeList.Status[])
    : Promise<AnimeList.Entry[] | Error> {
        if (!('name' in user)) {
            return new Error('Only support getting list by username');
        }
        const malStatuses = statuses.map(stat => ToLocalStatus[stat]);
        let headers: any;
        let query: string;
        let selfName: string | undefined = undefined;
        const myInfo = await this.getMyInfo();
        if (!(user instanceof Error)) {
            selfName = myInfo.name;
        }
        if (user.name === selfName) {
            const token = await this.getToken();
            if (token instanceof Error) {
                return token;
            }
            headers = {
                'Authorization': `Bearer ${token.access_token}`,
            };
            query = `https://api.myanimelist.net/v2/users/@me/animelist`;
        } else {
            headers = {
                'X-MAL-CLIENT-ID': this.clientID,
            };
            query = `https://api.myanimelist.net/v2/users/${user.name}/animelist`;
        }
        query += `?` + new URLSearchParams({
            fields: `list_status,media_type,num_episodes`,
            limit: '1000',
            nsfw: 'true',
        });

        const ret: AnimeList.Entry[] = [];
        do {
            const resp = await async_GM_xmlhttpRequest({
                method: 'GET',
                headers: headers,
                url: query,
            });
            if (resp === null || resp.status !== 200) {
                console.log(resp);
                return new Error(`Query failed: ${query}`);
            }
            const respData = JSON.parse(resp.responseText);
            for (let entry of respData.data) {
                if (malStatuses.includes(entry.list_status.status)) {
                    ret.push({
                        malID: entry.node.id,
                        status: ToGlobalStatus[entry.list_status.status as MyAnimeListStatus],
                        title: entry.node.title,
                        type: ToGlobalSeriesType[entry.node.media_type as MyAnimeListSeriesType],
                        updateOnImport: true,
                        numEpisodes: entry.node.num_episodes,
                    });
                }
            }
            query = respData.paging.next;
        } while (query);
        return ret;
    }

    public async importList(entries: AnimeList.Entry[], overwrite: boolean): Promise<Error | null> {
        if (!this.logined()) {
            return new Error('Not logined');
        }
        if (overwrite) {
            const err = await this.deleteList();
            if (err) {
                return err;
            }
            console.log('[importList] delete all entries successfully');
        }
        const reqs: Promise<Error | null>[] = [];
        for (let entry of entries) {
            await asyncWait(this.reqDelay);
            reqs.push(this.updateAnime(entry.malID, entry.status));
        }
        let retry = 3;
        while (retry--) {
            const errs = await Promise.all(reqs);
            let count = 0;
            for (let [idx, err] of errs.entries()) {
                if (err) {
                    console.warn(`Anime "${entries[idx].title}" update failed:`, err);
                    count++;
                    if (retry > 0) {
                        await asyncWait(this.reqDelay);
                        reqs[idx] = this.updateAnime(entries[idx].malID, entries[idx].status);
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
        const user = await this.getMyInfo();
        if (user instanceof Error) {
            return user;
        }
        let retry = 3;
        while (retry--) {
            const entries = await this.getList({name: user.name},
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
                reqs.push(this.deleteAnime(entry.malID));
            }
            const errs = await Promise.all(reqs);
            for (let [idx, err] of errs.entries()) {
                if (err) {
                    console.warn(`Anime "${entries[idx].title}" delete failed:`, err);
                }
            }
        }
        return null;
    }

    private async getUser(): Promise<MyAnimeListUser | Error> {
        const token = await this.getToken();
        if (token instanceof Error) {
            return token;
        }
        const query = `https://api.myanimelist.net/v2/users/@me`;
        const resp = await async_GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
            },
            url: query,
        });
        if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${query}`);
        }
        const user = JSON.parse(resp.responseText);
        return {
            id: user.id,
            name: user.name,
        };
    }

    private async refreshToken(): Promise<MyAnimeListAccessToken | Error> {
        const oldToken: MyAnimeListAccessToken | undefined = GM_getValue('MyAnimeList_accessToken');
        if (oldToken === undefined) {
            return new Error('No token to refresh');
        }
        const clientAuth = window.btoa(`${this.clientID}:${this.clientSecret}`);
        const data = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: oldToken.refresh_token,
        });
        const resp = await async_GM_xmlhttpRequest({
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${clientAuth}`,
            },
            url: this.tokenBaseURL,
            data: data.toString(),
        });
        if (resp === null || resp.status !== 200) {
            return new Error('Refresh token failed');
        }
        const newToken: MyAnimeListAccessToken = JSON.parse(resp.responseText);

        newToken.expires_in = Date.now() + ((newToken.expires_in - 86400) * 1000);
        GM_setValue('MyAnimeList_accessToken', newToken);
        return newToken;
    }

    private async getToken(): Promise<MyAnimeListAccessToken | Error> {
        const token: MyAnimeListAccessToken | undefined = GM_getValue('MyAnimeList_accessToken');
        if (token === undefined) {
            return new Error('Not logined');
        } else if (Date.now() > token.expires_in) {
            return this.refreshToken();
        } else {
            return token;
        }
    }
}