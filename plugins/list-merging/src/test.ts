import * as AnimeList from "anime-list";

const USER = {
    name: 'NCTUed',
    id: 1336697,
};
const SINGLE_SERIES_TYPE: AnimeList.Status = 'Dropped';
const ALL_SERIES_TYPE: AnimeList.Status[] = 
    ['Completed', 'Dropped', 'On-Hold', 'Plan to Watch', 'Watching'];
const LOGIN_OPT = {
    grantTypes: 'Authorization Code',
} as const;
const SAMPLE_ANIMES = [
    {
        // Danmachi IV
        id: 47164,
        malId: 47164,
        anilistId: 129196,
        kitsuId: 44031,
        title: 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka IV: Shin Shou - Meikyuu-hen'
    },
    {
        // Danmachi III
        id: 40454,
        malId: 40454,
        anilistId: 112124,
        kitsuId: 42583,
        title: 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka III'
    }
]

let animeList: AnimeList.AnimeList;

export function doTest() {
    const factory = new AnimeList.MyAnimeListFactory();
    animeList = factory.getInstance();
    (async () => {
        console.log('[test] Test start');
        let err: Error | null = null;
        
        err = await testLogin();
        if (err) {
            console.error(err);
            return;
        }

        err = await testGetMyInfo();
        if (err) {
            console.error(err);
            return;
        }
        
        err = await testAddAnime();
        if (err) {
            console.error(err);
            return;
        }

        err = await testDeleteAnime();
        if (err) {
            console.error(err);
            return;
        }

        err = await testImportList();
        if (err) {
            console.error(err);
            return;
        }
        
        console.log('[test] Test end');
    })();

}

async function testLogin() {
    console.log('[testLogin] Start Login test');
    console.log('[testLogin] before logined: logined =', animeList.logined());
    let err = await animeList.login(LOGIN_OPT);
    if (err) {
        return err;
    }
    console.log('[testLogin] after logined: logined =', animeList.logined());
    console.log('[testLogin] End Login test');
    return null;
}

async function testGetMyInfo() {
    console.log('[testGetMyInfo] Start GetMyInfo test');
    if (animeList.logined()) {
        const myInfo = await animeList.getMyInfo();
        if (myInfo instanceof Error) {
            return myInfo;
        }
        console.log('[testGetMyInfo] logined user:', myInfo);
    } else {
        console.log('[testGetMyInfo] Not logined');
    }
    console.log('[testGetMyInfo] End GetMyInfo test');
    return null;
}

async function testGetList() {
    console.log('[testGetList] Start GetList test');
    let result = await animeList.getList(USER, ALL_SERIES_TYPE);
    if (result instanceof Error) {
        return result;
    }
    console.log('[testGetList] all entries:', result);
    console.log('[testGetList] End GetList test');
    return null;
}

async function testAddAnime() {
    console.log('[testAddAnime] Start AddAnime test');
    let err = await animeList.updateAnime(SAMPLE_ANIMES[0].id, SINGLE_SERIES_TYPE);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USER, [SINGLE_SERIES_TYPE]);
    if (result instanceof Error) {
        return result;
    }
    console.log(`[testAddAnime] Entries ${SINGLE_SERIES_TYPE} after add:`, result);
    console.log('[testAddAnime] End AddAnime test');
    return null;
}

async function testDeleteAnime() {
    console.log('[testDeleteAnime] Start DeleteAnime test');
    let err = await animeList.deleteAnime(SAMPLE_ANIMES[0].id);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USER, [SINGLE_SERIES_TYPE]);
    if (result instanceof Error) {
        return result;
    }
    console.log(`[testDeleteAnime] Entries ${SINGLE_SERIES_TYPE} after delete:`, result);
    console.log('[testDeleteAnime] End DeleteAnime test');
    return null;
}

async function testImportList() {
    console.log('[testImportList] Start ImportList test');
    const input = GM_getValue('test') as AnimeList.Entry[];
    console.log('[testImportList] input entries:', input);
    const start = Date.now();
    let err = await animeList.importList(input, true);
    if (err) {
        return err;
    }
    console.log(`[testImportList] importList elapsed time=${(Date.now() - start) / 1000}`)
    let result = await animeList.getList(USER, ALL_SERIES_TYPE);
    if (result instanceof Error) {
        return result;
    }
    console.log('[testImportList] all entries after import with overwrite:', result);
    console.log('[testImportList] End ImportList test');
    return null;
}

async function testUpdateList() {
    console.log('[testUpdateList] Start UpdateList test');
    const input = GM_getValue('test') as AnimeList.Entry[];
    console.log('[testUpdateList] input entries:', input);
    let err = await animeList.importList(input, false);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USER, ALL_SERIES_TYPE);
    if (result instanceof Error) {
        return result;
    }
    console.log('[testUpdateList] all entries after import without overwrite:', result);
    console.log('[testUpdateList] End UpdateList test');
    return null;
}

async function testUpdateSmallList() {
    console.log('[UpdateSmallList] Start UpdateList test');
    let err = await animeList.importList([
        {
            malID: SAMPLE_ANIMES[0].malId,
            status: SINGLE_SERIES_TYPE,
            title: SAMPLE_ANIMES[0].title,
            type: 'TV',
            updateOnImport: true,
        },
        {
            malID: SAMPLE_ANIMES[1].malId,
            status: SINGLE_SERIES_TYPE,
            title: SAMPLE_ANIMES[1].title,
            type: 'TV',
            updateOnImport: true,
        }
    ], false);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USER, [SINGLE_SERIES_TYPE]);
    if (result instanceof Error) {
        return result;
    }
    console.log(`[UpdateSmallList] Entries ${SINGLE_SERIES_TYPE} after import without overwrite:`, result);
    console.log('[UpdateSmallList] End UpdateList test');
    return null;
}

async function testDeleteList() {
    console.log('[testDeleteList] Start DeleteList test');
    let err = await animeList.deleteList();
    if (err) {
        return err;
    }
    let result = await animeList.getList(USER, ALL_SERIES_TYPE);
    if (result instanceof Error) {
        return result;
    }
    console.log('[testDeleteList] all entries after delete list:', result);
    console.log('[testDeleteList] End DeleteList test');
    return null;
}

async function testLogout() {
    console.log('[testLogout] Start Logout test');
    console.log('[testLogout] before logout: logined =', animeList.logined());
    let err = await animeList.logout();
    if (err) {
        return err;
    }
    console.log('[testLogout] after logout: logined =', animeList.logined());
    console.log('[testLogout] End Logout test');
    return null;
}

async function testToXML() {
    console.log('[testToXML] Start ToXML test');
    const xml = AnimeList.entryToXml(14881854, 'NCTUed', [
        {
            malID: SAMPLE_ANIMES[0].malId,
            status: SINGLE_SERIES_TYPE,
            title: SAMPLE_ANIMES[0].title,
            type: 'TV',
            updateOnImport: true,
        },
        {
            malID: SAMPLE_ANIMES[1].malId,
            status: SINGLE_SERIES_TYPE,
            title: SAMPLE_ANIMES[1].title,
            type: 'TV',
            updateOnImport: true,
        },
    ]);
    console.log('[testToXML] XML output:', (new XMLSerializer()).serializeToString(xml.documentElement));
    console.log('[testToXML] End ToXML test');
    return null;
}

async function testFromXML() {
    console.log('[testFromXML] Start FromXML test');
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <myanimelist>
        <myinfo>
            <user_id>14881854</user_id>
            <user_name>NCTUed</user_name>
            <user_export_type>1</user_export_type>
            <user_total_anime>1000</user_total_anime>
            <user_total_watching>1</user_total_watching>
            <user_total_completed>999</user_total_completed>
            <user_total_onhold>0</user_total_onhold>
            <user_total_dropped>0</user_total_dropped>
            <user_total_plantowatch>0</user_total_plantowatch>
        </myinfo>
        <anime>
            <series_animedb_id>41380</series_animedb_id>
            <series_title><![CDATA[100-man no Inochi no Ue ni Ore wa Tatteiru]]></series_title>
            <series_type>TV</series_type>
            <series_episodes>12</series_episodes>
            <my_id>0</my_id>
            <my_watched_episodes>12</my_watched_episodes>
            <my_start_date>0000-00-00</my_start_date>
            <my_finish_date>0000-00-00</my_finish_date>
            <my_rated></my_rated>
            <my_score>0</my_score>
            <my_storage></my_storage>
            <my_storage_value>0.00</my_storage_value>
            <my_status>Completed</my_status>
            <my_comments><![CDATA[]]></my_comments>
            <my_times_watched>0</my_times_watched>
            <my_rewatch_value></my_rewatch_value>
            <my_priority>LOW</my_priority>
            <my_tags><![CDATA[]]></my_tags>
            <my_rewatching>0</my_rewatching>
            <my_rewatching_ep>0</my_rewatching_ep>
            <my_discuss>1</my_discuss>
            <my_sns>default</my_sns>
            <update_on_import>1</update_on_import>
        </anime>
        <anime xmlns="http://www.w3.org/1999/xhtml">
            <series_animedb_id>44881</series_animedb_id>
            <series_title><![CDATA[100-man no Inochi no Ue ni Ore wa Tatteiru 2nd Season]]></series_title>
            <series_type>TV</series_type>
            <series_episodes>12</series_episodes>
            <my_id>0</my_id>
            <my_watched_episodes>12</my_watched_episodes>
            <my_start_date>0000-00-00</my_start_date>
            <my_finish_date>2021-12-01</my_finish_date>
            <my_rated></my_rated>
            <my_score>0</my_score>
            <my_storage></my_storage>
            <my_storage_value>0.00</my_storage_value>
            <my_status>Completed</my_status>
            <my_comments><![CDATA[]]></my_comments>
            <my_times_watched>0</my_times_watched>
            <my_rewatch_value></my_rewatch_value>
            <my_priority>LOW</my_priority>
            <my_tags><![CDATA[]]></my_tags>
            <my_rewatching>0</my_rewatching>
            <my_rewatching_ep>0</my_rewatching_ep>
            <my_discuss>1</my_discuss>
            <my_sns>default</my_sns>
            <update_on_import>1</update_on_import>
        </anime>
    </myanimelist>`;
    const entries = AnimeList.xmlToEntry($.parseXML(xml));
    console.log('[testFromXML] Entries output:', entries);
    console.log('[testFromXML] End FromXML test');
    return null;
}