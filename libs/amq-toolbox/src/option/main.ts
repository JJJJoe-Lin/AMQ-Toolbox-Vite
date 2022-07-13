import { AmqtbCheckbox } from './checkbox';
import { AmqtbRadio } from './radio';

export type AmqtbOption = AmqtbCheckbox | AmqtbRadio;

interface AmqtbOptionsOptions {
    id?: string;
    class?: string;
    title?: string;
}

export class AmqtbOptions {
    self: JQuery<HTMLElement>;
    private options: Map<string, AmqtbOption>;

    constructor (opt: AmqtbOptionsOptions) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.options = new Map();
        this.self = $(`<div></div>`)
            .addClass('col-xs-6')
            .attr('id', id)
            .addClass(cls);
        if (opt.title !== undefined) {
            this.self.append($(`<h4>${opt.title}</h4>`).css('text-align', 'center'));
        }
    }

    refresh () {
        for (let opt of this.options.values()) {
            if ('enables' in opt) {
                this.updateEnabled(opt);
            }
        }
    }

    add (...options: AmqtbOption[]) {
        for (let option of options) {
            if (option.name) {
                if (this.options.has(option.name)) {
                    console.warn(`Skip adding duplicated option '${option.name}' in this options`);
                    continue;
                }
                this.options.set(option.name, option);
            }
            this.self.append(option.self);
            if (option instanceof AmqtbCheckbox) {
                option.input.on('click', () => {
                    this.updateEnabled(option as AmqtbCheckbox);
                });
            }
        }
    }

    get (opt: string | AmqtbOption) {
        if (typeof opt === 'string') {
            return this.options.get(opt);
        } else {
            return opt.name === undefined ? undefined : this.options.get(opt.name);
        }
    }

    has (opt: string | AmqtbOption) {
        if (typeof opt === 'string') {
            return this.options.has(opt);
        } else {
            return opt.name === undefined ? false : this.options.has(opt.name);
        }
    }

    private updateEnabled (opt: AmqtbCheckbox) {
        for (let enableOptId of opt.enables) {
            let enableOpt = this.options.get(enableOptId);
            if (enableOpt) {
                if (enableOpt instanceof AmqtbCheckbox) {
                    if (opt.checked) {
                        enableOpt.checked = true;
                    } else {
                        enableOpt.checked = false;
                    }
                }
                if (opt.checked) {
                    enableOpt.enabled = true;
                } else {
                    enableOpt.enabled = false;
                }
            }
        }
    }
}

export * from './checkbox';
export * from './radio';