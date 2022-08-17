import { IComponent } from '../component';
import { Container, ContainerOpt, IContainer } from './container';

export interface TabOpt extends ContainerOpt<IComponent> {
    tabName: string;
    contentId?: string;
    contentClass?: string;
}

export interface ITab extends IContainer<IComponent> {
    content: JQuery<HTMLElement>;
}; 

export class Tab extends Container<IComponent> implements ITab {
    readonly content: JQuery<HTMLElement>;
    private components = this.container;

    constructor (opt: TabOpt) {
        super(opt);
        const contentId = opt.contentId === undefined ? '' : opt.contentId;
        const contentClass = opt.contentClass === undefined ? '' : opt.contentClass;
        this.self.addClass('tab leftRightButtonTop clickAble')
            .append($(`<h5></h5>`).text(opt.tabName));
        this.content = $(`<div></div>`)
            .attr('id', contentId)
            .addClass(contentClass);
        this.content.hide();
    }

    protected appendComponent(component: IComponent): void {
        this.content.append(component.self);
    }

    public hide(): void {
        super.hide();
        this.content.hide();
    }
}