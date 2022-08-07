import * as AnimeList from "anime-list";

const USERNAME = 'NCTUed';
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
        anilistId: 111,
        kitsuId: 111,
    },
    {
        // Danmachi III
        id: 40454,
        malId: 40454,
        anilistId: 111,
        kitsuId: 111,
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

        err = await testGetList();
        if (err) {
            console.error(err);
            return;
        }
        
        console.log('[test] Test end');
    })();

}

async function testLogin() {
    console.log('[testLogin] Start Login test');
    console.log('[testLogin] before logined: logined =', animeList.logined(), 'user =', animeList.user);
    let err = await animeList.login(LOGIN_OPT);
    if (err) {
        return err;
    }
    console.log('[testLogin] after logined: logined =', animeList.logined(), 'user =', animeList.user);
    console.log('[testLogin] End Login test');
    return null;
}

async function testGetList() {
    console.log('[testGetList] Start GetList test');
    let result = await animeList.getList(USERNAME, ALL_SERIES_TYPE);
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
    let result = await animeList.getList(USERNAME, [SINGLE_SERIES_TYPE]);
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
    let result = await animeList.getList(USERNAME, [SINGLE_SERIES_TYPE]);
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
    let err = await animeList.importList(input, true);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USERNAME, ALL_SERIES_TYPE);
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
    let err = await animeList.importList(input, false);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USERNAME, ALL_SERIES_TYPE);
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
            title: 'test1',
            type: 'TV',
            updateOnImport: true,
        },
        {
            malID: SAMPLE_ANIMES[1].malId,
            status: SINGLE_SERIES_TYPE,
            title: 'test2',
            type: 'TV',
            updateOnImport: true,
        }
    ], false);
    if (err) {
        return err;
    }
    let result = await animeList.getList(USERNAME, [SINGLE_SERIES_TYPE]);
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
    let result = await animeList.getList(USERNAME, ALL_SERIES_TYPE);
    if (result instanceof Error) {
        return result;
    }
    console.log('[testDeleteList] all entries after delete list:', result);
    console.log('[testDeleteList] End DeleteList test');
    return null;
}

async function testLogout() {
    console.log('[testLogout] Start Logout test');
    let err = await animeList.logout();
    if (err) {
        return err;
    }
    console.log('[testLogout] after logout: logined =', animeList.logined(), 'user =', animeList.user);
    console.log('[testLogout] End Logout test');
    return null;
}