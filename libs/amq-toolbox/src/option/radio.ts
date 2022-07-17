export interface AmqtbRadioOptions {
    id: string;
    name?: string;
    label?: string;
    description?: string;
    choices: AmqtbRadioChoiseOptions[];
    onSave?: (data: string) => void;
    onLoad?: () => string;
}

export interface AmqtbRadioChoiseOptions {
    label: string;
    value: string;
}

export class AmqtbRadio {
    readonly self: JQuery<HTMLElement>;
    readonly input: JQuery<HTMLElement>;
    readonly label?: JQuery<HTMLElement>
    readonly id: string;
    readonly name?: string;
    private readonly choices: AmqtbRadioChoiseOptions[];
    private readonly onSave?: (data: string) => void;
    private readonly onLoad?: () => string;

    constructor (opt: AmqtbRadioOptions) {
        this.id = opt.id;
        this.name = opt.name;
        if (opt.choices.length > 10) {
            this.choices = opt.choices.slice(0, 10);
        } else {
            this.choices = opt.choices;
        }
        this.self = $(`<div class='amqtbRadio'></div>`);
        if (opt.label) {
            this.label = $(`<label></label>`)
                .text(opt.label)
                .css('width', '100%');
            if (opt.description) {
                this.label.popover({
                    content: opt.description,
                    trigger: 'hover',
                    html: true,
                    placement: 'top',
                    container: '#settingModal',
                });
            }
            this.self.append(this.label);
        }
        // bootstrap-slider
        // const defaultValue = GM_getValue(opt.id, opt.defaultValue);
        // let idx = this.choices.findIndex(c => c.value === defaultValue);
        // idx = idx === -1 ? 0 : idx;
        this.input = $(`<input class='sliderInput' type='text'>`);
        this.self.append(this.input);
        this.input.bootstrapSlider({
            id: this.id,
            ticks: this.choices.map((_, idx) => idx),
            ticks_labels: this.choices.map(ch => ch.label),
            value: 0,
            formatter: (idx) => this.choices[idx].label,
            selection: 'none',
        });
        this.input.on('change', () => {
            this.save(this.value)
        });
        this.onSave = opt.onSave;
        this.onLoad = opt.onLoad;
        this.value = this.load();
    }

    relayout () {
        this.input.bootstrapSlider('relayout');
    }

    get value() {
        const idx = this.input.bootstrapSlider('getValue') as unknown as number;
        return this.choices[idx].value;
    }

    set value(val: string) {
        const idx = this.choices.findIndex(c => c.value === val);
        if (idx !== -1) {
            this.input.bootstrapSlider('setValue', idx);
        }
    }

    get enabled() {
        return this.input.bootstrapSlider('isEnabled') as unknown as boolean;
    }

    set enabled(val: boolean) {
        if (val) {
            this.self.show();
            this.relayout();
        } else {
            this.self.hide();
        }
    }

    load() {
        // return GM_getValue(this.id, defaultVal);
        return this.onLoad !== undefined ? this.onLoad() : '';
    }

    save(val: string) {
        // GM_setValue(this.id, val);
        if (this.onSave) {
            this.onSave(val);
        }
    }
}