export function async_GM_xmlhttpRequest(
    details: Omit<Tampermonkey.Request<any>, 'onload' | 'onerror' | 'ontimeout'>
): Promise<Tampermonkey.Response<any> | null> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...details,
            onload: (response) => {resolve(response)},
            onerror: (err) => {
                console.error(`Request for ${details.url} error:`, err);
                resolve(null);
            },
            ontimeout: () => {
                console.error(`Request for ${details.url} timeout`);
                resolve(null);
            }
        });
    });
}

export async function asyncWait(ms: number): Promise<void> {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}