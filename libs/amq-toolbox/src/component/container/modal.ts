import { IComponent } from '../component';
import { Container, ContainerOpt, IContainer } from './container';

const SIZE_MAP = {
    'large': 'btn-lg',
    'normal': '',
    'small': 'btn-sm',
} as const;

type ModalSize = keyof (typeof SIZE_MAP);

export interface ModalOpt extends ContainerOpt {
    title: string;
    size: ModalSize;
}

export interface IModal extends IContainer<IComponent> {}

export class Modal extends Container<IComponent> implements IModal {
    private contentBlock: JQuery<HTMLElement>;
    private components = this.container;

    constructor (opt: ModalOpt) {
        super(opt);
        const dialog = $(`<div class="modal-dialog" role="document"></div>`)
            .addClass(SIZE_MAP[opt.size]);
        const content = $(`<div class="modal-content"></div>`);
        const header = $(`<div class="modal-header"></div>`);
        const title = $(`<h2 class="modal-title">${opt.title}</h2>`);
        const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`)
            .append($(`<span aria-hidden="true">×</span>`));
        this.contentBlock = $(`<div class="modal-body"></div>`);
        this.self.addClass('modal fade')
            .attr('tabindex', '-1')
            .attr('role', 'dialog')
            .append(
                dialog
                .append(
                    content
                    .append(
                        header
                        .append(closeIcon, title)
                    )
                    .append(this.contentBlock)
                )
            );
        $("#gameContainer").append(this.self);
    }

    protected appendComponent(component: IComponent): void {
        this.contentBlock.append(component.self);
    }

    public show(): void {
        this.self.modal('show');
    }

    public hide(): void {
        this.self.modal('hide');
    }
}