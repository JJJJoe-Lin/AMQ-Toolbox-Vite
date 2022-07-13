export function toTitle(str: string): string {
    let ret = str.replace(/[_].?/g, letter => letter.slice(1).toUpperCase());
    ret = ret.replace(/[A-Z]/g, letter => ` ${letter}`);
    ret = ret.charAt(0).toUpperCase() + ret.slice(1);
    return ret;
}