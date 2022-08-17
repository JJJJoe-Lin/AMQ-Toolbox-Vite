import {
    Container,
    ContainerOpt,
    IComponent,
    IContainer,
    IValuable,
} from '../component/main';

interface ViewOpt {
    title: string;
    content: JQuery<HTMLElement>;
}

export class View implements IComponent {
    readonly self: JQuery<HTMLElement>;
    constructor (opt: ViewOpt) {
        this.self = $(`<div class="row"></div>`);
        const header = $(`<h5 class="collapsible"></h5>`).text(opt.title);
        header.on('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling as HTMLElement;
            if (content.style.display === '') {
                content.style.display = 'none';
            } else {
                content.style.display = '';
            }
        });
        this.self.append(header, opt.content);
    }
}

export class ViewBlock extends Container<View> implements IContainer<View> {
    constructor (opt: ContainerOpt<View>) {
        super(opt);
        this.self.attr('id', 'qpToolboxContainer')
            .addClass('container floatingContainer');
    }
}

export class Text implements IValuable<string> {
    readonly self: JQuery<HTMLElement>;
    constructor () {
        this.self = $(`<p></p>`);
    }
    setValue(val: string): void {
        this.self.text(val);
    }
    getValue(): string {
        return this.self.text();
    }
}

export class Switch implements IValuable<boolean> {
    readonly self: JQuery<HTMLElement>;
    private readonly switch: JQuery<HTMLElement>;
    private readonly switchOn: JQuery<HTMLElement>;
    private readonly switchOff: JQuery<HTMLElement>;
    constructor () {
        this.switchOff = $(`<div class="switchOff slider-tick round"></div>`);
        this.switchOn = $(`<div class="switchOn slider-tick round"></div>`);
        this.switch = $(`<div class="switchContainer slider-track"></div>`)
            .append($(`<div class="slider-tick-container"></div>`)
                .append(this.switchOff)
                .append(this.switchOn)
            );
        this.self = $(`<div></div>`)
            .addClass(`amqtbPluginManageTableEnabledCell`)
            .append(this.switch);
        this.switch.on('click', () => {
            this.setValue(!this.getValue());
        });
    }
    setValue(val: boolean): void {
        if (val) {
            this.switchOn.show();
            this.switchOff.hide();
            this.switch.addClass('active');
        } else {
            this.switchOn.hide();
            this.switchOff.show();
            this.switch.removeClass('active');
        }
    }
    getValue(): boolean {
        return this.switch.hasClass('active');
    }
}