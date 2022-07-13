export interface AmqtbTabOptions {
    id?: string;
    class?: string;
    name?: string;
    title: string;
    containerId?: string;
    containerClass?: string;
}

export class AmqtbTab {
    self: JQuery<HTMLElement>;
    container: JQuery<HTMLElement>;
    name?: string;
    
    constructor (opt: AmqtbTabOptions) {
        let id = opt.id === undefined ? '' : opt.id;
        let cls = opt.class === undefined ? '' : opt.class;
        let ctid = opt.containerId === undefined ? '' : opt.containerId;
        let ctcls = opt.containerClass === undefined ? '' : opt.containerClass; 

        this.self = $(`<div></div>`)
            .attr('id', id)
            .addClass(cls)
            .addClass('tab leftRightButtonTop clickAble')
            .append($(`<h5></h5>`)
                .text(opt.title)
            );
        this.container = $(`<div></div>`)
            .attr('id', ctid)
            .addClass(ctcls)
            .addClass('hide');
        this.name = opt.name;
    }
}