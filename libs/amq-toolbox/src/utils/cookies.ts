declare var Cookies: any;

const attr = {
    expires: 365,
    Domain: "animemusicquiz.com",
    secure: true,
};

export function saveToCookie (key: string, entry: any) {
    Cookies.set(key, JSON.stringify(entry), attr);
}

export function loadFromCookie<T> (key: string, defaultVal?: T | undefined): T | undefined {
    let val = Cookies.get(key);
    if (val === undefined) {
        return defaultVal;
    } else {
        return JSON.parse(val);
    }
}

export function deleteCookie (key: string) {
    Cookies.remove(key, attr);
}