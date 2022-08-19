import { loadFromCookie, saveToCookie } from '../../utils/cookies';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import { toTitle } from '../../utils/string';
import { Button } from '../button';
import { ComponentOpt, IComponent } from '../component';
import { Buttons } from '../container/buttons';
import { IValuable } from '../valuable/valuable';
import { SaveIn } from '../valuable/option/option';


type Schema =  Record<string, IValuable<any>>;

type Fields<T extends Schema> = {
    [K in keyof T]: T[K];
};

type RowData<T extends Schema> = {
    [K in keyof T]: T[K] extends IValuable<infer U> ? U : never;
}

type Row<T extends Schema> = {
    elem: JQuery<HTMLElement>;
    fields: Fields<T>;
}

export interface TableOpt<T extends Schema> extends ComponentOpt {
    name: string;
    title?: string;
    newRow: () => T;
    defaultValue?: RowData<T>[];
    addOrDeletable: boolean;
    movable: boolean;
    saveIn?: SaveIn;
}

export interface ITable<T extends Schema> extends IComponent {
    name: string;
    table: JQuery<HTMLElement>;
    getValue(): RowData<T>[];
    setValue(val: RowData<T>[]): void;
    save: () => void;
    load: () => void;
    createRow(data?: RowData<T>): Row<T>;
    splice(start: number, deleteCount?: number): Row<T>[];
    splice(start: number, deleteCount: number, ...rows: Row<T>[]): Row<T>[];
    append(row: Row<T>): void;
    getButton(name: 'add' | 'save' | 'reset'): Button | undefined;
}

export class Table<T extends Schema> implements ITable<T> {
    readonly self;
    readonly table;
    readonly name;
    private readonly buttonBlock;
    private readonly saveIn;
    private readonly body;
    private newRow: () => Fields<T>;
    private addOrDeletable;
    private movable;
    private savable;
    private rows: Row<T>[];
    
    constructor (opt: TableOpt<T>) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.name = opt.name;
        this.saveIn = opt.saveIn;
        this.newRow = opt.newRow;
        this.addOrDeletable = opt.addOrDeletable;
        this.movable = opt.movable;
        this.savable = opt.saveIn === undefined ? false : true;
        this.rows = [];
        
        this.self = $(`<div class="row"></div>`)
            .attr('id', id)
            .addClass(cls);
        if (opt.title) {
            this.self.append($(`<h4 style="text-align: center;"><b>${opt.title}</b></h4>`));
        }
        // create table header
        const header = $(`<thead></thead>`);
        const headerRow = $(`<tr></tr>`);
        for (let fieldName of Object.keys(this.newRow())) {
            headerRow.append(`<th>${toTitle(fieldName)}</th>`);
        }
        if (opt.addOrDeletable || opt.movable) {
            headerRow.append(`<th></th>`);
        }
        header.append(headerRow);
        // create table body
        this.body = $(`<tbody></tbody>`);
        // create table
        this.table = $(`<table class="table amqtbTable"></table>`)
            .append(header)
            .append(this.body);
        this.self.append($(`<div></div>`).append(this.table));
        // create button block
        const btns: Button[] = [];
        if (this.addOrDeletable) {
            const btn = new Button({
                name: 'add',
                label: 'Add New',
                size: 'default',
                style: 'success',
            });
            btn.self.on('click', () => {
                this.append(this.createRow());
            });
            btns.push(btn);
        }
        if (this.savable) {
            const saveBtn = new Button({
                name: 'save',
                label: 'Save',
                size: 'default',
                style: 'success',
            });
            saveBtn.self.on('click', () => {
                this.save();
            });
            const resetBtn = new Button({
                name: 'reset',
                label: 'Reset',
                size: 'default',
                style: 'danger',
            });
            resetBtn.self.on('click', () => {
                this.load();
            });
            btns.push(saveBtn, resetBtn);
        }
        if (btns.length > 0) {
            this.buttonBlock = new Buttons({
                name: 'tableButtons',
            });
            this.buttonBlock.push(...btns);
            this.self.append(this.buttonBlock.self);
        } else {
            this.buttonBlock = null;
        }
    }
    
    createRow(data?: RowData<T> | undefined): Row<T> {
        // create component for each field
        const newFields = this.newRow();
        // append components to the row
        const rowElem = $(`<tr></tr>`);
        for (let field of Object.keys(newFields)) {
            if (data) {
                newFields[field].setValue(data[field]);
            }
            rowElem.append($(`<td></td>`).append(newFields[field].self));
        }
        const row: Row<T> = {
            elem: rowElem,
            fields: newFields,
        }
        // add button
        const buttons: Button[] = [];
        if (this.addOrDeletable) {
            const delBtn = new Button({
                label: '',
                name: 'delBtn',
                size: 'small',
                style: 'danger',
            });
            delBtn.self.append($(`<i class="fa fa-trash" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    const idx = this.rows.findIndex(r => r === row);
                    if (idx !== -1) {
                        this.splice(idx, 1);
                    }
                });
            buttons.push(delBtn);
        }
        if (this.movable) {
            const upBtn = new Button({
                label: '',
                name: 'upBtn',
                size: 'small',
                style: 'primary',
            });
            upBtn.self.append($(`<i class="fa fa-arrow-up" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    this.moveUp(row);
                });
            const downBtn = new Button({
                label: '',
                name: 'downBtn',
                size: 'small',
                style: 'primary',
            });
            downBtn.self.append($(`<i class="fa fa-arrow-down" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    this.moveDown(row);
                });
            buttons.push(upBtn, downBtn);
        }
        if (buttons.length > 0) {
            const td = $(`<td></td>`).append(buttons.map(btn => btn.self));
            rowElem.append(td);
        }
        return row;
    }

    append(row: Row<T>): void {
        this.body.append(row.elem);
        this.rows.push(row);
    }

    splice(start: number, deleteCount?: number | undefined): Row<T>[];
    splice(start: number, deleteCount: number, ...rows: Row<T>[]): Row<T>[];
    splice(start: number, deleteCount?: number, ...rows: Row<T>[]): Row<T>[] {
        for (let row of this.rows) {
            row.elem.detach();
        }
        let deleted: Row<T>[];
        if (deleteCount === undefined) {
            deleted = this.rows.splice(start);
        } else {
            deleted = this.rows.splice(start, deleteCount, ...rows);
        }
        for (let row of this.rows) {
            this.body.append(row.elem);
        }
        return deleted;
    }

    getButton(name: 'add' | 'save' | 'reset'): Button | undefined {
        if (this.buttonBlock) {
            return this.buttonBlock.find(btn => btn.name === name);
        } else {
            return undefined;
        }
    }

    getValue(): RowData<T>[] {
        let datas: RowData<T>[] = [];
        for (let row of this.rows) {
            const data = Object.fromEntries(Object.entries(row.fields).map(([field, cp]) => {
                return [field, cp.getValue()];
            })) as RowData<T>;
            datas.push(data);
        }
        return datas;
    }

    setValue(datas: RowData<T>[]): void {
        this.splice(0);
        for (let data of datas) {
            this.splice(this.rows.length, 0, this.createRow(data));
        }
    }

    save(): void {
        switch (this.saveIn) {
            case 'Script':
                GM_setValue(this.name, this.getValue());
                break;
            case 'LocalStorage':
                saveToLocalStorage(this.name, this.getValue());
                break;
            case 'Cookie':
                saveToCookie(this.name, this.getValue());
                break;
            default:
        }
    }

    load(): void {
        let val: RowData<T>[] | undefined;
        switch (this.saveIn) {
            case 'Script':
                val = GM_getValue(this.name);
                break;
            case 'LocalStorage':
                val = loadFromLocalStorage(this.name);
                break;
            case 'Cookie':
                val = loadFromCookie(this.name);
                break;
            default:
        }
        if (val !== undefined) {
            this.setValue(val);
        }
    }

    private moveUp(row: Row<T>): void {
        const idx = this.rows.findIndex(r => r === row);
        if (idx > 0) {
            row.elem.detach();
            row.elem.insertBefore(this.rows[idx - 1].elem);
            [this.rows[idx], this.rows[idx - 1]] = [this.rows[idx - 1], this.rows[idx]];
        }
    }

    private moveDown(row: Row<T>): void {
        const idx = this.rows.findIndex(r => r === row);
        if (idx > -1 && idx < this.rows.length - 1) {
            row.elem.detach();
            row.elem.insertAfter(this.rows[idx + 1].elem);
            [this.rows[idx], this.rows[idx + 1]] = [this.rows[idx + 1], this.rows[idx]];
        }
    }
}
