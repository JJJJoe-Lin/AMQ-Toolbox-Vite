import { IValuable, ValuableOpt } from './valuable';

export interface TextInputOpt extends ValuableOpt<string> {
    type?: 'text' | 'password';
    placeholder?: string;
}

export class TextInput implements IValuable<string> {
    readonly name;
    readonly self: JQuery<HTMLElement>;
    protected readonly input: JQuery<HTMLElement>;

    constructor (opt: TextInputOpt) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        const inputType = opt.type === undefined ? 'text' : opt.type;
        const placeholder = opt.placeholder === undefined ? '' : opt.placeholder;
        this.name = opt.name;
        this.self = $(`<div class='amqtbTextInput'></div>`)
            .attr('id', id)
            .addClass(cls);
        this.input = $(`<input type="${inputType}"></input>`)
            .addClass('form-control input-sm')
            .attr('placeholder', placeholder);
        this.self.append(this.input);
        if (opt.defaultValue !== undefined) {
            this.setValue(opt.defaultValue);
        }
    }

    public setValue(val: string): void {
        this.input.val(val);
    }

    public getValue(): string {
        const ret = this.input.val();
        if (ret === undefined) {
            return '';
        } else {
            return ret.toString();
        }
    }
}