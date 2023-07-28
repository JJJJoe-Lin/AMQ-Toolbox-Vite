import {
    IOptionComponent,
    OptionComponentOpt,
    loadStorable,
    saveStorable
} from './option';

export interface RadioChoise<T extends string | number | boolean> {
    label: string;
    value: T;
}

export interface RadioOptionOpt<T extends string | number | boolean> extends OptionComponentOpt<T> {
    label: string;
    description?: string;
    choices: RadioChoise<T>[];
}

export interface IRadioOption<T> extends IOptionComponent<T> {
    relayout(): void;
}

export class RadioOption<T extends string | number | boolean> implements IRadioOption<T> {
    readonly name;
    readonly self: JQuery<HTMLElement>;
    readonly input: JQuery<HTMLElement>;
    readonly enables;
    private readonly saveIn;
    private readonly choices;

    constructor (opt: RadioOptionOpt<T>) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.saveIn = opt.saveIn;
        this.enables = opt.enables;
        this.name = opt.name;
        if (opt.choices.length > 10) {
            this.choices = opt.choices.slice(0, 10);
        } else {
            this.choices = opt.choices;
        }
        this.self = $(`<div class='amqtbRadio'></div>`)
            .attr('id', id)
            .addClass(cls)
            .addClass(opt.offset !== 0 ? `offset${opt.offset}` : '');
        if (opt.label) {
            const label = $(`<label></label>`)
                .text(opt.label)
                .css('width', '100%');
            if (opt.description) {
                label.popover({
                    content: opt.description,
                    trigger: 'hover',
                    placement: 'top',
                });
            }
            this.self.append(label);
        }
        // bootstrap-slider
        this.input = $(`<input class='sliderInput' type='text'>`);
        this.self.append(this.input);
        this.input.bootstrapSlider({
            id: opt.inputId,
            ticks: this.choices.map((_, idx) => idx),
            ticks_labels: this.choices.map(ch => ch.label),
            value: 0,
            formatter: (idx) => this.choices[idx].label,
            selection: 'none',
        });
        this.input.on('change', () => {
            this.save();
            this.input.trigger('amqtoolbox.option.enables', this.getValue());
        });
        // set default value
        const val = opt.defaultValue === undefined ? this.choices[0].value : opt.defaultValue;
        this.setValue(val);
        // load value
        this.load();
        this.input.trigger('amqtoolbox.option.enables', this.getValue());
    }

    public getValue(): T {
        const idx = this.input.bootstrapSlider('getValue') as unknown as number;
        return this.choices[idx].value;
    }

    public setValue(val: T): void {
        const idx = this.choices.findIndex(c => c.value === val);
        if (idx !== -1) {
            this.input.bootstrapSlider('setValue', idx);
        }
    }

    public enabled(): boolean {
        return this.input.bootstrapSlider('isEnabled') as unknown as boolean;
    }

    public enable() {
        this.self.show();
        this.relayout();
    }

    public disable() {
        this.self.hide();
    }

    public save() {
        saveStorable(this, this.saveIn);
    }

    public load() {
        loadStorable(this, this.saveIn);
    }

    public relayout () {
        this.input.bootstrapSlider('relayout');
    }
}