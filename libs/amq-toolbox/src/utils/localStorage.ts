export function saveToLocalStorage (key: string, entry: any) {
    localStorage.setItem(key, JSON.stringify(entry));
}

export function loadFromLocalStorage (key: string, defaultVal?: any) {
    const val = localStorage.getItem(key);
    if (val === null) {
        return defaultVal;
    } else {
        return JSON.parse(val);
    }
}

export function deleteLocalStorage (key: string) {
    localStorage.removeItem(key);
}