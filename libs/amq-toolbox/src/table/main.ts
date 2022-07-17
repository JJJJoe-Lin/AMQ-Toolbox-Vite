import { AmqtbButton, AmqtbButtonContainer } from "../button/main";
import { toTitle } from "../utils/string";

type AmqtbTableSchema = Record<string, any>;

interface AmqtbTableOptions<Schema extends AmqtbTableSchema> {
    id: string;
    class?: string;
    title?: string;
    fieldNames: Array<keyof Schema>;
    addable: boolean;
    deletable: boolean;
    movable: boolean;
    settable: boolean;
    newRow: () => AmqtbTableCells<Schema>;
    onSave?: (data: AmqtbTableCellsData<Schema>[]) => void;
    onLoad?: () => AmqtbTableCellsData<Schema>[] | undefined;
}

type AmqtbTableCells<Schema> = {
    [K in keyof Schema]: AmqtbTableCell<Schema[K]>;
};

type AmqtbTableCellsData<Schema> = {
    [K in keyof Schema]: Schema[K];
};

type AmqtbTableRow<Schema> = AmqtbTableCells<Schema> & {
    _elem: JQuery<HTMLElement>;
};

export interface AmqtbTableCell<T> {
    elem: JQuery<HTMLElement>;
    value: T;
}

export class AmqtbTable<T> {
    readonly self: JQuery<HTMLElement>;
    readonly table: JQuery<HTMLElement>;
    readonly id: string;
    readonly entries: AmqtbTableRow<T>[] = [];
    readonly addBtn?: AmqtbButton;
    readonly saveBtn?: AmqtbButton;
    readonly resetBtn?: AmqtbButton;
    private readonly genRowElem: () => AmqtbTableCells<T>;
    private readonly header: JQuery<HTMLElement>;
    private readonly body: JQuery<HTMLElement>;
    private readonly deletable: boolean;
    private readonly movable: boolean;
    private readonly onSave?: (data: AmqtbTableCellsData<T>[]) => void;
    private readonly onLoad?: () => AmqtbTableCellsData<T>[] | undefined;

    constructor (opt: AmqtbTableOptions<T>) {
        const cls = opt.class === undefined ? '' : opt.class;
        const title = opt.title === undefined ? null : opt.title;

        this.id = opt.id;
        this.genRowElem = opt.newRow;
        
        const tr = $(`<tr></tr>`);
        for (let field of opt.fieldNames as string[]) {
            tr.append($(`<th>${toTitle(field)}</th>`));
        }
        if (opt.deletable || opt.movable) {
            tr.append($(`<th></th>`));
        }
        this.header = $(`<thead></thead>`).append(tr);
        this.body = $(`<tbody></tbody>`);

        this.table = $(`<table class="table amqtbTable"></table>`)
            .attr('id', opt.id)
            .addClass(cls)
            .append(this.header)
            .append(this.body);
        this.self = $(`<div class="row"></div>`)
        if (title !== null) {
            this.self.append($(`<h4 style="text-align: center;"><b>${title}</b></h4>`));
        }
        this.self.append($(`<div></div>`).append(this.table));

        this.deletable = opt.deletable;
        this.movable = opt.movable;
        const buttons: AmqtbButton[] = [];
        if (opt.addable) {
            this.addBtn = new AmqtbButton({
                label: 'Add New',
                size: 'default',
                style: 'success',
            });
            this.addBtn.self.on('click', () => {
                this.appendRow();
            });
            buttons.push(this.addBtn);
        }
        if (opt.settable) {
            this.saveBtn = new AmqtbButton({
                label: 'Save',
                size: 'default',
                style: 'success',
            });
            this.saveBtn.self.on('click', () => {
                this.dump();
            });
            this.resetBtn = new AmqtbButton({
                label: 'Reset',
                size: 'default',
                style: 'danger',
            });
            this.resetBtn.self.on('click', () => {
                this.reset();
            });
            buttons.push(this.saveBtn, this.resetBtn);
        }
        if (buttons.length > 0) {
            const btnContainer = new AmqtbButtonContainer({});
            for (let btn of buttons) {
                btnContainer.add(btn);
            }
            this.self.append(btnContainer.self);
        }

        this.onSave = opt.onSave;
        this.onLoad = opt.onLoad;

        this.reset();
    }

    private createRow (rowData?: AmqtbTableCellsData<T>) {
        const cells = this.genRowElem();
        if (rowData !== undefined) {
            for (let fieldName of Object.keys(rowData) as (keyof T)[]) {
                cells[fieldName].value = rowData[fieldName];
            }
        }
        const row: AmqtbTableRow<T> = {
            ...cells,
            _elem: $(`<tr></tr>`),
        }
        for (let fieldName of Object.keys(cells) as (keyof T)[]) {
            const cell = cells[fieldName];
            const td = $(`<td></td>`).append(cell.elem);
            row._elem.append(td);
        }
        const buttons: AmqtbButton[] = [];
        if (this.deletable) {
            const delBtn = new AmqtbButton({
                label: '',
                name: 'delBtn',
                size: 'small',
                style: 'danger',
            });
            delBtn.self.append($(`<i class="fa fa-trash" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    row._elem.remove();
                    const idx = this.entries.findIndex(r => r === row);
                    this.entries.splice(idx, 1);
                });
            buttons.push(delBtn);
        }
        if (this.movable) {
            const upBtn = new AmqtbButton({
                label: '',
                size: 'small',
                style: 'primary',
            });
            upBtn.self.append($(`<i class="fa fa-arrow-up" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    const prev = row._elem.prev();
                    const cur = row._elem;
                    if (prev.length != 0) {
                        cur.detach().insertBefore(prev);
                    }
                    const idx = this.entries.findIndex(r => r === row);
                    if (idx > 0) {
                        [this.entries[idx - 1], this.entries[idx]] = [this.entries[idx], this.entries[idx - 1]];
                    }
                });
            const downBtn = new AmqtbButton({
                label: '',
                size: 'small',
                style: 'primary',
            });
            downBtn.self.append($(`<i class="fa fa-arrow-down" style="font-size: 15px;"></i>`))
                .on('click', () => {
                    let next = row._elem.next();
                    let cur = row._elem;
                    if (next.length != 0) {
                        cur.detach().insertAfter(next);
                    }
                    const idx = this.entries.findIndex(r => r === row);
                    if (idx < this.entries.length - 1) {
                        [this.entries[idx], this.entries[idx + 1]] = [this.entries[idx + 1], this.entries[idx]];
                    }
                });
            buttons.push(upBtn, downBtn);
        }
        if (buttons.length > 0) {
            const td = $(`<td></td>`).append(buttons.map(btn => btn.self));
            row._elem.append(td);
        }
        return row;
    }

    appendRow (rowData?: AmqtbTableCellsData<T>) {
        const row = this.createRow(rowData);
        console.log(`Append new row on table '${this.id}':`, row);
        this.body.append(row._elem);
        this.entries.push(row);
    }

    insertRowBefore (target: AmqtbTableRow<T>, rowData?: AmqtbTableCellsData<T>) {
        const newRow = this.createRow(rowData);
        const idx = this.entries.findIndex(row => row === target);
        if (idx !== -1) {
            console.log(`Insert new row on table[${idx}] '${this.id}':`, newRow);
            newRow._elem.insertBefore(target._elem);
            this.entries.splice(idx, 0, newRow);
        }
    }

    dump () {
        const datas = [];
        for (let row of this.entries) {
            const rowData: Partial<AmqtbTableCellsData<T>> = {};
            for (let fieldName of Object.keys(row) as (keyof T)[] | ['_elem']) {
                if (fieldName !== '_elem') {
                    rowData[fieldName] = (row as AmqtbTableCells<T>)[fieldName].value;
                }
            }
            datas.push(rowData as AmqtbTableCellsData<T>);
        }
        console.log(`Save table '${this.id}':`, datas);
        // GM_setValue(this.id, datas);
        if (this.onSave) {
            this.onSave(datas);
        }
    }

    reset () {
        this.body.empty();
        this.entries.length = 0;
        // const datas = GM_getValue(this.id) as AmqtbTableCellsData<T>[] | undefined;
        const datas = this.onLoad !== undefined ? this.onLoad() : undefined;
        console.log(`Reset and load table '${this.id}':`, datas);
        if (datas !== undefined) {
            for (let rowData of datas) {
                this.appendRow(rowData);
            }
        }
    }
}
