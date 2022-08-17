import { IComponent, ComponentOpt } from '../component';

export interface IContainer<T extends IComponent> extends IComponent {
    push(...components: T[]): void,
    pop(): T | undefined;
    clear(): T[];
    splice(start: number, deleteCount?: number): T[];
    splice(start: number, deleteCount: number, ...components: T[]): T[];
    at(idx: number): T | undefined;
    find(callbackFn: (elem: T, idx: number, arr: T[]) => boolean): T | undefined;
    get(name: string): T | undefined;
    get length(): number;
    [Symbol.iterator](): IterableIterator<T>;
    show(): void;
    hide(): void;
    isVisible(): boolean;
}

export interface ContainerOpt<T extends IComponent> extends ComponentOpt {}

export abstract class Container<T extends IComponent> implements IContainer<T> {
    readonly self: JQuery<HTMLElement>;
    readonly name;
    protected readonly container: T[];
    constructor (opt: ContainerOpt<T>) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.name = opt.name;
        this.self = $(`<div></div>`)
            .attr('id', id)
            .addClass(cls);
        this.container = [];
    }
    push(...components: T[]): void {
        this.splice(this.length, 0, ...components);
    }
    pop(): T | undefined {
        const ret = this.splice(-1, 1);
        return ret.length === 0 ? undefined : ret[0];
    }
    at(idx: number): T | undefined {
        return this.container.at(idx);
    }
    find(callbackFn: (elem: T, idx: number, arr: T[]) => boolean): T | undefined {
        return this.container.find(callbackFn);
    }
    get(name: string): T | undefined {
        return this.find(elem => elem.name === name);
    }
    splice(start: number, deleteCount?: number): T[];
    splice(start: number, deleteCount: number, ...components: T[]): T[];
    splice(start: number, deleteCount?: number, ...components: T[]): T[] {
        // detach all elem
        for (let component of this.container) {
            this.detachComponent(component);
        }
        // splice for container
        let deleted: T[];
        if (deleteCount === undefined) {
            deleted = this.container.splice(start);
        } else {
            deleted = this.container.splice(start, deleteCount, ...components);
        }
        // append all elem
        for (let component of this.container) {
            this.appendComponent(component);
        }
        return deleted;
    }
    clear(): T[] {
        return this.splice(0);
    }
    get length(): number {
        return this.container.length;
    }
    [Symbol.iterator](): IterableIterator<T> {
        return this.container.values();
    }
    show(): void {
        this.self.show();
    }
    hide(): void {
        this.self.hide();
    }
    isVisible(): boolean {
        return this.self.is(':visible');
    }
    protected appendComponent(component: T): void {
        this.self.append(component.self);
    }
    protected detachComponent(component: T): void {
        component.self.detach();
    }
}