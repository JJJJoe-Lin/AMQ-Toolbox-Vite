import { IValuable, ValuableOpt } from "./valuable";

interface SelectChoise<T> {
    label: string;
    value: T;
}

export interface SingleSelectOpt<T extends string> extends ValuableOpt<T> {
    choices: SelectChoise<T>[];
}

export interface ISingleSelect<T extends string> extends IValuable<T> {}

export class SingleSelect<T extends string> implements ISingleSelect<T> {
    public self: JQuery<HTMLElement>;
    private button: JQuery<HTMLElement>;
    private menu: JQuery<HTMLElement>;
    private value: T;
    constructor (opt: SingleSelectOpt<T>) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<div class="dropdown"></div>`)
            .css('display', 'inline-block')
            .attr('id', id)
            .addClass(cls);
        this.button = $(`<button type="button" data-toggle="dropdown"></button>`)
            .addClass('btn btn-default dropdown-toggle');
        this.menu = $(`<ul class="dropdown-menu"></ul>`);
        for (let choice of opt.choices) {
            const li = $(`<li></li>`);
            const a = $(`<a href="#"></a>`).text(choice.label);
            a.on('click', () => {
                this.setValue(choice.value);
            });
            this.menu.append(li.append(a));
        }
        this.self.append(this.button, this.menu);
        // set value
        this.value = opt.defaultValue === undefined ? opt.choices[0].value : opt.defaultValue;
        this.setValue(this.value);
    }
    public getValue(): T {
        return this.value;
    }
    public setValue(val: T): void {
        this.value = val;
        this.button.text(`${val} `);
        this.button.append($(`<span class="caret"></span>`));
    }
}

export interface MultiSelectOpt<T extends string> extends ValuableOpt<T[]> {
    label: string;
    choices: SelectChoise<T>[];
}

export interface IMultiSelect<T extends string> extends IValuable<T[]> {}

export class MultiSelect<T extends string> implements IMultiSelect<T> {
    public self: JQuery<HTMLElement>;
    private button: JQuery<HTMLElement>;
    private menu: JQuery<HTMLElement>;
    private options: {selected: boolean, value: T}[];
    constructor (opt: MultiSelectOpt<T>) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<div class="amqtbMultiSelect dropdown"></div>`)
            .css('display', 'inline-block')
            .attr('id', id)
            .addClass(cls);
        this.button = $(`<button type="button" data-toggle="dropdown"></button>`)
            .addClass('btn btn-default dropdown-toggle')
            .text(`${opt.label} `);
        this.button.append($(`<span class="caret"></span>`));
        this.menu = $(`<ul class="dropdown-menu"></ul>`);
        this.options = [];
        for (let [idx, choice] of opt.choices.entries()) {
            const li = $(`<li></li>`);
            const a = $(`<a href="#"><input type="checkbox"> ${choice.label}</a>`);
            a.on('click', (e) => {
                this.toggle(idx, e.eventPhase === 2);
            });
            this.menu.append(li.append(a));
            this.options.push({selected: false, value: choice.value});
        }
        this.self.append(this.button, this.menu);
        // set value
        const value = opt.defaultValue === undefined ? [] : opt.defaultValue;
        this.setValue(value);
    }
    public getValue(): T[] {
        return this.options.filter(opt => opt.selected).map(opt => opt.value);
    }
    public setValue(val: T[]): void {
        for (let [idx, opt] of this.options.entries()) {
            if (opt.selected !== val.includes(opt.value)) {
                this.toggle(idx, true);
            }
        }
    }
    private toggle(idx: number, toogleCheckbox: boolean) {
        const a = this.menu.find('li > a').eq(idx);
        this.options[idx].selected = !this.options[idx].selected;
        if (this.options[idx].selected) {
            a.addClass('selected');
            if (toogleCheckbox) {
                a.children('input').prop('checked', true);
            }
        } else {
            a.removeClass('selected');
            if (toogleCheckbox) {
                a.children('input').prop('checked', false);
            }
        }
    }
}