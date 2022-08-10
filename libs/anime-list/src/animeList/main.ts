import { AuthOptions } from "../utils/oauth2";

export type Status = 'Watching' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan to Watch';
export type SeriesType = 'Unknown' | 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music';

export interface User {
    id: number;
    name: string;
}

export interface Date {
    year: number;
    month: number;
    day: number;
}

export interface Entry {
    malID: number;
    title: string;
    type: SeriesType;
    numEpisodes?: number;
    myID?: number;
    numEpisodesWatched?: number;
    startDate?: Date;
    finishDate?: Date;
    rated?: any;
    score?: number;
    storage?: any;
    storageValue?: number;
    status: Status;
    comments?: string;
    timesWatched?: number;
    rewatchValue?: any;
    priority?: string;
    tags?: any;
    rewatching?: number;
    rewatchingEP?: number;
    discuss?: number;
    sns?: string;
    updateOnImport: boolean;
}

export abstract class AnimeList {
    /**
     * Get access token with OAuth2
     * @param opt OAuth2 option
     */
    public abstract login(opt: AuthOptions): Promise<null | Error>;
    public abstract logined(): boolean;
    public abstract logout(): Promise<null | Error>;
    /**
     * (Need login) Get logined user info
     */
    public abstract getMyInfo(): Promise<User | Error>;
    /**
     * (Need login) Add anime to logined user's anime list
     * @param id anime ID
     * @param status 
     */
    public abstract updateAnime(id: number, status: Status): Promise<null | Error>;
    /**
     * (Need login) Remove anime from logined user's anime list
     * @param id anime ID
     */
    public abstract deleteAnime(id: number): Promise<null | Error>;
    /**
     * Get user's anime list that is in some statuses
     * @param user user's ID or username
     * @param statuses status list to obtain
     */
    public abstract getList(user: { id: number; } | { name: string; }, statuses: Status[]): Promise<Entry[] | Error>;
    /**
     * Delete logined user's anime list
     */
    public abstract deleteList(): Promise<null | Error>;
    /**
     * Import animes to logined user's anime list
     * @param entries animes to import
     * @param overwrite whether delete list before import
     */
    public abstract importList(entries: Entry[], overwrite: boolean): Promise<null | Error>;
}

export abstract class AnimeListFactory {
    public abstract getInstance(): AnimeList;
}

export function entryToXml(userID: number, userName: string, entries: Entry[]): XMLDocument {
    const numWatching = entries.reduce((sum, entry) => entry.status === 'Watching' ? ++sum : sum, 0);
    const numCompleted = entries.reduce((sum, entry) => entry.status === 'Completed' ? ++sum : sum, 0);
    const numOnHold = entries.reduce((sum, entry) => entry.status === 'On-Hold' ? ++sum : sum, 0);
    const numDropped = entries.reduce((sum, entry) => entry.status === 'Dropped' ? ++sum : sum, 0);
    const numPlanToWatch = entries.reduce((sum, entry) => entry.status === 'Plan to Watch' ? ++sum : sum, 0);
    const numItems = numWatching + numCompleted + numOnHold + numDropped + numPlanToWatch;
    const fill = (value: any, defaultValue: any) => value === undefined ? defaultValue : value;
    const root = $($.parseXML(`
    <myanimelist>
        <myinfo>
            <user_id>${userID}</user_id>
            <user_name>${userName}</user_name>
            <user_export_type>1</user_export_type>
            <user_total_anime>${numItems}</user_total_anime>
            <user_total_watching>${numWatching}</user_total_watching>
            <user_total_completed>${numCompleted}</user_total_completed>
            <user_total_onhold>${numOnHold}</user_total_onhold>
            <user_total_dropped>${numDropped}</user_total_dropped>
            <user_total_plantowatch>${numPlanToWatch}</user_total_plantowatch>
        </myinfo>
    </myanimelist>
    `));
    for (let entry of entries) {
        const startDate = entry.startDate === undefined ? '0000-00-00' : dateConverter(entry.startDate);
        const finishDate = entry.finishDate === undefined ? '0000-00-00' : dateConverter(entry.finishDate);
        const node = $($.parseXML(`
        <anime>
            <series_animedb_id>${entry.malID}</series_animedb_id>
            <series_title>${entry.title}</series_title>
            <series_type>${entry.type}</series_type>
            <series_episodes>${entry.numEpisodes}</series_episodes>
            <my_id>${fill(entry.myID, 0)}</my_id>
            <my_watched_episodes>${fill(entry.numEpisodesWatched, 0)}</my_watched_episodes>
            <my_start_date>${startDate}</my_start_date>
            <my_finish_date>${finishDate}</my_finish_date>
            <my_rated>${fill(entry.rated, '')}</my_rated>
            <my_score>${fill(entry.score, 0)}</my_score>
            <my_storage>${fill(entry.storage, '')}</my_storage>
            <my_storage_value>${entry.storageValue, '0.00'}</my_storage_value>
            <my_status>${entry.status}</my_status>
            <my_comments>${fill(entry.comments, '')}</my_comments>
            <my_times_watched>${fill(entry.timesWatched, 0)}</my_times_watched>
            <my_rewatch_value>${fill(entry.rewatchValue, '')}</my_rewatch_value>
            <my_priority>${fill(entry.priority, 'LOW')}</my_priority>
            <my_tags>${fill(entry.tags, '')}</my_tags>
            <my_rewatching>${fill(entry.rewatching, 0)}</my_rewatching>
            <my_rewatching_ep>${fill(entry.rewatchingEP, 0)}</my_rewatching_ep>
            <my_discuss>${fill(entry.discuss, 1)}</my_discuss>
            <my_sns>${fill(entry.sns, 'default')}</my_sns>
            <update_on_import>${entry.updateOnImport ? 1 : 0}</update_on_import>
        </anime>
        `)).find('anime');
        root.find('myanimelist').append(node);
    }
    return root.get(0)!;
}

export function xmlToEntry(xml: XMLDocument): Entry[] {
    const ret: Entry[] = [];
    $(xml).find('anime').each((_, elem) => {
        const startDate: Date = {year: 0, month: 0, day: 0};
        [startDate.year, startDate.month, startDate.day] = 
            $(elem).find('my_start_date').text().split('-').map(str => parseInt(str, 10));
        const finishDate: Date = {year: 0, month: 0, day: 0};
        [startDate.year, startDate.month, startDate.day] = 
            $(elem).find('my_finish_date').text().split('-').map(str => parseInt(str, 10));
        ret.push({
            malID: parseInt($(elem).find('series_animedb_id').text(), 10),
            title: $(elem).find('series_title').text(),
            type: $(elem).find('series_type').text() as SeriesType,
            numEpisodes: parseInt($(elem).find('series_episodes').text(), 10),
            myID: parseInt($(elem).find('my_id').text(), 10),
            numEpisodesWatched: parseInt($(elem).find('my_watched_episodes').text(), 10),
            startDate: startDate,
            finishDate: finishDate,
            rated: $(elem).find('my_rated').text(),
            score: parseInt($(elem).find('my_score').text(), 10),
            storage: $(elem).find('my_storage').text(),
            storageValue: parseInt($(elem).find('my_storage_value').text(), 10),
            status: $(elem).find('my_status').text() as Status,
            comments: $(elem).find('my_comments').text(),
            timesWatched: parseInt($(elem).find('my_times_watched').text(), 10),
            rewatchValue: $(elem).find('my_rewatch_value').text(),
            priority: $(elem).find('my_priority').text(),
            tags: $(elem).find('my_tags').text(),
            rewatching: parseInt($(elem).find('my_rewatching').text(), 10),
            rewatchingEP: parseInt($(elem).find('my_rewatching_ep').text(), 10),
            discuss: parseInt($(elem).find('my_discuss').text(), 10),
            sns: $(elem).find('my_sns').text(),
            updateOnImport: $(elem).find('update_on_import').text() === '0' ? false : true,
        });
    });
    return ret;
}

function dateConverter(date: Date): string {
    const format: Intl.NumberFormatOptions = {
        minimumIntegerDigits: 2,
        useGrouping: false,
    }
    return `${date.year}-${date.month.toLocaleString('en-US', format)}-${date.day.toLocaleString('en-US', format)}`;
}