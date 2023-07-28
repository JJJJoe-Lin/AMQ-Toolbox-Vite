import {
    IOptionComponent,
    OptionComponentOpt,
    loadStorable,
    saveStorable
} from './option';

export interface CheckboxOptionOpt extends OptionComponentOpt<boolean> {
    label: string;
    description?: string;
}

export interface ICheckboxOption extends IOptionComponent<boolean> {}

export class CheckboxOption implements ICheckboxOption {
    readonly name;
    readonly self: JQuery<HTMLElement>;
    readonly input: JQuery<HTMLElement>;
    readonly enables;
    private readonly saveIn;

    constructor (opt: CheckboxOptionOpt) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.saveIn = opt.saveIn;
        this.name = opt.name;
        this.enables = opt.enables;
        this.input = $(`<input id="${opt.inputId}" type="checkbox">`);
        this.input.on('click', () => {
            this.save();
            this.input.trigger('amqtoolbox.option.enables', this.getValue() ? 'true' : 'false');
        });
        const checkLabel = $(`<label for="${opt.inputId}"></label>`)
            .append($(`<i class='fa fa-check' aria-hidden='true'></i>`));
        const textLabel = $(`<label for="${opt.inputId}"></label>`)
            .addClass("customCheckboxContainerLabel")
            .text(opt.label);
        if (opt.description) {
            textLabel.popover({
                content: opt.description,
                trigger: 'hover',
                placement: 'top',
            });
        }
        this.self = $(`<div class='customCheckboxContainer'></div>`)
            .attr('id', id)
            .addClass(cls)
            .addClass(opt.offset !== 0 ? `offset${opt.offset}` : '')
            .append($(`<div class='customCheckbox'></div>`)
                .append(this.input)
                .append(checkLabel)
            )
            .append(textLabel);
        // set default value
        const checked = opt.defaultValue ? true : false;
        this.setValue(checked);
        // load value
        this.load();
        this.input.trigger('amqtoolbox.option.enables', this.getValue());
    }

    public getValue(): boolean {
        return this.input.prop('checked');
    }

    public setValue(val: boolean): void {
        this.input.prop('checked', val);
    }

    public enabled(): boolean {
        return !this.self.hasClass('disabled');
    }

    public enable() {
        this.self.removeClass('disabled');
    }

    public disable() {
        this.self.addClass('disabled');
    }

    public save() {
        saveStorable(this, this.saveIn);
    }

    public load() {
        loadStorable(this, this.saveIn);
    }
}