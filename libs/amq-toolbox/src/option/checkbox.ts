export interface AmqtbCheckboxOptions {
    id: string;
    name?: string;
    description?: string;
    defaultChecked: boolean;
    label: string;
    offset: number;
    enables: string[];
}

export class AmqtbCheckbox {
    readonly self: JQuery<HTMLElement>;
    readonly input: JQuery<HTMLElement>;
    readonly id: string;
    readonly name?: string;
    enables: string[];

    constructor (opt: AmqtbCheckboxOptions) {
        this.id = opt.id;
        this.name = opt.name;
        this.enables = opt.enables;

        this.input = $(`<input id="${this.id}" type="checkbox">`)
            .on(`click`, () => {
                this.save(this.checked);
            });
        const checkLabel = $(`<label for="${this.id}"></label>`)
            .append($(`<i class='fa fa-check' aria-hidden='true'></i>`));
        const textLabel = $(`<label for="${this.id}"></label>`)
            .addClass("customCheckboxContainerLabel")
            .text(opt.label);
        if (opt.description) {
            textLabel.popover({
                content: opt.description,
                trigger: 'hover',
                html: true,
                placement: 'top',
                container: '#settingModal',
            });
        }
        this.self = $(`<div class='customCheckboxContainer'></div>`)
            .addClass(opt.offset !== 0 ? `offset${opt.offset}` : '')
            .append($(`<div class='customCheckbox'></div>`)
                .append(this.input)
                .append(checkLabel)
            )
            .append(textLabel);
        
        this.checked = this.load(opt.defaultChecked);
    }

    get checked() {
        return this.input.prop('checked');
    }

    set checked(val: boolean) {
        this.input.prop('checked', val);
    }

    get enabled() {
        return !this.self.hasClass('disabled');
    }

    set enabled(val: boolean) {
        if (val) {
            this.self.removeClass('disabled');
        } else {
            this.self.addClass('disabled');
        }
    }

    load(defaultVal: boolean) {
        return GM_getValue(this.id, defaultVal);
    }

    save(val: boolean) {
        GM_setValue(this.id, val);
    }
}