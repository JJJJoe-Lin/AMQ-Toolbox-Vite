import { GM_xmlhttpRequest, XhrRequest } from '$';

/* [WORKAROUND]
"vite-plugin-monkey" isn't export TResponse,
so copy it from "vite-plugin-monkey/client.d.ts"
*/
export type TResponse<TContext> = {
    readonly responseHeaders: string;
    /**
     * Unsent = 0,
     * Opened = 1,
     * HeadersReceived = 2,
     * Loading = 3,
     * Done = 4
     */
    readonly readyState: 0 | 1 | 2 | 3 | 4;
    readonly response: any;
    readonly responseText: string;
    readonly responseXML: Document | null;
    readonly status: number;
    readonly statusText: string;
    readonly finalUrl: string;
    readonly context: TContext;
};

export function async_GM_xmlhttpRequest(
    details: Omit<XhrRequest<object>, 'onload' | 'onerror' | 'ontimeout'>
): Promise<TResponse<object> | null> {
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