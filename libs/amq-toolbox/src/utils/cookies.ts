declare var Cookies: any;

export function saveToCookie (key: string, entry: any) {
    let attr = {
        expires: 365,
        Domain: "animemusicquiz.com",
        secure: true,
    };
    Cookies.set(key, JSON.stringify(entry), attr);
}

export function loadFromCookie (key: string) {
    let val = Cookies.get(key);
    if (val === undefined) {
        return null;
    } else {
        return JSON.parse(val);
    }
}