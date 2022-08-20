import { Entry } from "anime-list";

export type Included = 'Optional' | 'Include' | 'Exclude';

export class EntrySet {
    private include: Entry[] | null;
    private optional: Entry[];
    private exclude: Entry[];
    constructor () {
        this.include = null;
        this.optional = [];
        this.exclude = [];
    }
    
    public update(entries: Entry[], included: Included): void {
        switch (included) {
            case 'Include': {
                if (this.include === null) {
                    this.include = [...entries];
                    this.difference(this.include, this.exclude);
                } else {
                    this.intersection(this.include, entries);
                }
                break;
            }
            case 'Optional': {
                if (this.include === null) {
                    this.union(this.optional, entries);
                }
                break;
            }
            case 'Exclude': {
                if (this.include === null) {
                    this.union(this.exclude, entries);
                } else {
                    this.difference(this.include, entries);
                }
                break;
            }
            default:
                break;
        }
    }

    public getResult(): Entry[] {
        if (this.include === null) {
            this.difference(this.optional, this.exclude);
            return this.optional;
        } else {
            return this.include;
        }
    }

    private union(dst: Entry[], src: Entry[]) {
        // no delete, use object to improve performance
        const temp: Record<number, Entry> = Object.fromEntries(dst.map(entry => [entry.malID, entry]));
        for (let entry of src) {
            if (!temp.hasOwnProperty(entry.malID)) {
                dst.push(entry);
            }
        }
    }
    
    private intersection(dst: Entry[], src: Entry[]) {
        const temp: Map<number, Entry> = new Map(dst.map(entry => [entry.malID, entry]));
        for (let entry of src) {
            if (!temp.has(entry.malID)) {
                temp.delete(entry.malID);
            }
        }
        dst.length = 0;
        dst.push(...temp.values());
    }
    
    private difference(dst: Entry[], src: Entry[]) {
        const temp: Map<number, Entry> = new Map(dst.map(entry => [entry.malID, entry]));
        for (let entry of src) {
            if (temp.has(entry.malID)) {
                temp.delete(entry.malID);
            }
        }
        dst.length = 0;
        dst.push(...temp.values());
    }
}