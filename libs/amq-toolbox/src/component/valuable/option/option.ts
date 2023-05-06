import { GM_setValue, GM_getValue } from '$';
import { loadFromCookie, saveToCookie } from '../../../utils/cookies';
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';
import { IValuable, ValuableOpt } from '../valuable';

type EnablesKey<T> = T extends boolean
    ? 'true' | 'false'
    : T extends string | number | symbol
    ? T
    : never;

export type SaveIn = 'Script' | 'LocalStorage' | 'Cookie';

export interface OptionComponentOpt<T> extends ValuableOpt<T> {
    name: string;
    inputId: string;
    saveIn: SaveIn;
    offset: number;
    enables?: Record<EnablesKey<T>, string[]>;
}
export interface IOptionComponent<T> extends IValuable<T> {
    readonly name: string;
    readonly enables?: Record<string, string[]>;
    readonly input: JQuery<HTMLElement>;
    save(): void;
    load(): void;
    enable(): void;
    disable(): void;
    enabled(): boolean;
};

export function saveStorable<T> (comp: IOptionComponent<T>, type: SaveIn) {
    switch (type) {
        case 'Script':
            GM_setValue(comp.name, comp.getValue());
            break;
        case 'LocalStorage':
            saveToLocalStorage(comp.name, comp.getValue());
            break;
        case 'Cookie':
            saveToCookie(comp.name, comp.getValue());
            break;
    }
}

export function loadStorable<T> (comp: IOptionComponent<T>, type: SaveIn) {
    let val: T | undefined;
    switch (type) {
        case 'Script':
            val = GM_getValue(comp.name);
            break;
        case 'LocalStorage':
            val = loadFromLocalStorage(comp.name);
            break;
        case 'Cookie':
            val = loadFromCookie(comp.name);
            break;
    }
    if (val !== undefined) {
        comp.setValue(val);
    }
}