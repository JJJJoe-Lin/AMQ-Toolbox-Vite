interface AmqtbButtonContainerOptions {
    id?: string;
    class?: string;
}

const AmqtbButtonSize = {
    'large': 'btn-lg',
    'default': '',
    'small': 'btn-sm',
    'extra-small': 'btn-xs',
} as const;

const AmqtbButtonStyle = {
    'default': 'btn-default',
    'primary': 'btn-primary',
    'success': 'btn-success',
    'info': 'btn-info',
    'warning': 'btn-warning',
    'danger': 'btn-danger',
    'link': 'btn-link',
} as const;

interface AmqtbButtonOptions {
    id?: string;
    class?: string;
    name?: string;
    label: string;
    size: keyof (typeof AmqtbButtonSize);
    style: keyof (typeof AmqtbButtonStyle);
}

export class AmqtbButton {
    self: JQuery<HTMLElement>;
    readonly id?: string;
    readonly name?: string;
    private _size: (typeof AmqtbButtonSize)[keyof (typeof AmqtbButtonSize)];
    private _style: (typeof AmqtbButtonStyle)[keyof (typeof AmqtbButtonStyle)];

    constructor(opt: AmqtbButtonOptions) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<button></button>`)
            .attr('id', id)
            .attr('type', 'button')
            .addClass(cls)
            .addClass(AmqtbButtonSize[opt.size])
            .addClass(AmqtbButtonStyle[opt.style])
            .text(opt.label);
        this.id = id;
        this.name = opt.name;
        this._size = AmqtbButtonSize[opt.size];
        this._style = AmqtbButtonStyle[opt.style];
    }

    set size(size: keyof (typeof AmqtbButtonSize)) {
        this.self.removeClass(this._size);
        this._size = AmqtbButtonSize[size];
        this.self.addClass(this._size);
    }

    set style(style: keyof (typeof AmqtbButtonStyle)) {
        this.self.removeClass(this._style);
        this._style = AmqtbButtonStyle[style];
        this.self.addClass(this._style);
    }

    set label(text: string) {
        this.self.text(text);
    }
}

export class AmqtbButtonContainer {
    self: JQuery<HTMLElement>;
    buttons: Map<string, AmqtbButton>;

    constructor(opt: AmqtbButtonContainerOptions) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<div></div>`)
            .attr('id', id)
            .addClass('amqtbButtonContainer')
            .addClass(cls);
        this.buttons = new Map();
    }

    add(...btns: AmqtbButton[]) {
        for (let btn of btns) {
            if (btn.name) {
                if (this.buttons.has(btn.name)) {
                    console.warn(`Skip adding duplicated button '${btn.name}' in this container`);
                    continue;
                }
                this.buttons.set(btn.name, btn);
            }
            this.self.append(btn.self);
        }
    }

    get (btn: string | AmqtbButton) {
        if (typeof btn === 'string') {
            return this.buttons.get(btn);
        } else {
            return btn.name === undefined ? undefined : this.buttons.get(btn.name);
        }
    }

    has (btn: string | AmqtbButton) {
        if (typeof btn === 'string') {
            return this.buttons.has(btn);
        } else {
            return btn.name === undefined ? false : this.buttons.has(btn.name);
        }
    }

    clear () {
        this.buttons.clear();
        this.self.empty();
    }
}
