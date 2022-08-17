import { Container, ContainerOpt, IContainer } from './container';
import { ITab } from './tab';

const SIZE_MAP = {
    'large': 'btn-lg',
    'normal': '',
    'small': 'btn-sm',
} as const;

type ModalSize = keyof (typeof SIZE_MAP);

export interface TabModalOpt extends ContainerOpt<ITab> {
    title: string;
    size: ModalSize;
}

export interface ITabModal extends IContainer<ITab> {
    select: (tab: ITab) => void;
}

export class TabModal extends Container<ITab> implements ITabModal {
    private contentBlock: JQuery<HTMLElement>;
    private tabBlock: JQuery<HTMLElement>;
    private tabs = this.container;
    private curTab: ITab | null;

    constructor (opt: TabModalOpt) {
        super(opt);
        const dialog = $(`<div class="modal-dialog" role="document"></div>`)
            .addClass(SIZE_MAP[opt.size]);
        const content = $(`<div class="modal-content"></div>`);
        const header = $(`<div class="modal-header"></div>`);
        const title = $(`<h4 class="modal-title">${opt.title}</h4>`);
        const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`)
            .append($(`<span aria-hidden="true">×</span>`));
        this.tabBlock = $(`<div class="tabContainer"></div>`);
        this.contentBlock = $(`<div class="modal-body"></div>`);
        this.self.addClass('modal fade tab-modal')
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
                    .append(this.tabBlock)
                    .append(this.contentBlock)
                )
            );
        this.curTab = null;
        $("#gameContainer").append(this.self);
    }

    public push(...tabs: ITab[]): void {
        super.push(...tabs);
        if (this.curTab === null && this.tabs.length > 0) {
            this.select(this.tabs[0]);
        }
    }

    public pop(): ITab | undefined {
        const tab = super.pop();
        if (this.curTab === tab && this.tabs.length > 0) {
            this.select(this.tabs[0]);
        }
        return tab;
    }

    public clear(): ITab[] {
        if (this.curTab) {
            this.curTab.self.removeClass('selected');
            this.curTab.content.hide();
        }
        this.curTab = null;
        return super.clear();
    }

    public show(): void {
        this.self.modal('show');
    }

    public hide(): void {
        this.self.modal('hide');
    }

    public select(tab: ITab): void {
        if (this.curTab) {
            this.curTab.self.removeClass('selected');
            this.curTab.content.hide();
        }
        tab.self.addClass('selected');
        tab.content.show();
        this.curTab = tab;
    }

    protected appendComponent(tab: ITab): void {
        tab.self.on('click', () => {
            this.select(tab);
        });
        this.tabBlock.append(tab.self);
        this.contentBlock.append(tab.content);
    }

    protected detachComponent(tab: ITab): void {
        tab.self.off('click');
        tab.self.detach();
        tab.content.detach();
        
    }
}