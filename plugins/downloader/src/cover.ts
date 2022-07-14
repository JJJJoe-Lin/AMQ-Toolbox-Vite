import { XMLParser } from 'fast-xml-parser';

export interface Image {
    data: ArrayBuffer;
    contentType: string;
}

export async function getAnimeImage (annId: number | null): Promise<Image | null> {
    if (annId === null) {
        return null;
    }
    const imageUrl = await getAnimeImageUrl(annId);
    if (imageUrl === null) {
        return null;
    }
    return await getImage(imageUrl);
}

function getImage(imageUrl: string): Promise<Image | null> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            onload: (resp) => {
                if (resp.status != 200) {
                    console.warn('fetch image failed');
                    resolve(null);
                } else {
                    const contentType = getAttrFromHeader(resp.responseHeaders, 'content-type');
                    if (contentType === undefined) {
                        resolve(null);
                    } else {
                        resolve({
                            data: resp.response,
                            contentType: contentType,
                        });
                    }
                }
            },
            
        });
    });
}

function getAttrFromHeader(headerText: string, targetAttr: string): string | undefined {
    const attrsText = headerText.split('\n');
    let ret: string | undefined = undefined;
    for (let attrText of attrsText) {
        const [attr, value] = attrText.split(/\s*:\s*/);
        if (attr === targetAttr) {
            ret = value;
        }
    }
    return ret;
}

async function getAnimeImageUrl (annId: number | null): Promise<string | null> {
    if (annId === null) {
        return null;
    }
    const res = await fetch(`https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=${annId}`);
    if (!res.ok) {
        console.warn('fetch cdn.animenewsnetwork.com failed');
        return null;
    }
    const xml = await res.text();
    const parser = new XMLParser({ignoreAttributes : false});
    const obj = parser.parse(xml);
    let ret: string | undefined = undefined;
    if (obj.ann && obj.ann.anime && obj.ann.anime.info && Array.isArray(obj.ann.anime.info)) {
        for (let info of obj.ann.anime.info) {
            if (info['@_type'] === 'Picture' && info.img && Array.isArray(info.img)) {
                const img = info.img[info.img.length -1];
                if (typeof img['@_src'] === 'string') {
                    ret = img['@_src'];
                }
            }
        }
    }
    return ret === undefined ? null : ret;
}