import { IComponent, ComponentOpt } from './component';

const SIZE_MAP = {
    'large': 'btn-lg',
    'default': '',
    'normal': 'btn',
    'small': 'btn-sm',
    'extra-small': 'btn-xs',
} as const;

const STYLE_MAP = {
    'default': 'btn-default',
    'primary': 'btn-primary',
    'success': 'btn-success',
    'info': 'btn-info',
    'warning': 'btn-warning',
    'danger': 'btn-danger',
    'link': 'btn-link',
} as const;

type ButtonSize = keyof (typeof SIZE_MAP);
type ButtonSizeBS = (typeof SIZE_MAP)[ButtonSize];
type ButtonStyle = keyof (typeof STYLE_MAP);
type ButtonStyleBS = (typeof STYLE_MAP)[ButtonStyle];

export interface ButtonOpt extends ComponentOpt {
    label: string;
    size: ButtonSize;
    style: ButtonStyle;
}

export class Button implements IComponent {
    readonly self: JQuery<HTMLElement>;
    readonly name;
    private _size: ButtonSizeBS;
    private _style: ButtonStyleBS;
    
    constructor (opt: ButtonOpt) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<button></button>`)
            .attr('id', id)
            .attr('type', 'button')
            .addClass(cls)
            .addClass(SIZE_MAP[opt.size])
            .addClass(STYLE_MAP[opt.style])
            .text(opt.label);
        this.name = opt.name;
        this._size = SIZE_MAP[opt.size];
        this._style = STYLE_MAP[opt.style];
    }

    set size(size: ButtonSize) {
        this.self.removeClass(this._size);
        this._size = SIZE_MAP[size];
        this.self.addClass(this._size);
    }

    set style(style: ButtonStyle) {
        this.self.removeClass(this._style);
        this._style = STYLE_MAP[style];
        this.self.addClass(this._style);
    }

    set label(text: string) {
        this.self.text(text);
    }
}