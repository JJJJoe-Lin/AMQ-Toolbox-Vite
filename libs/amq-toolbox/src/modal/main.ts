import { AmqtbTabContainer } from "../tab/main";

interface AmqtbModalOptions {
    id: string;
    class?: string;
    title: string;
    content: JQuery<HTMLElement> | AmqtbTabContainer;
    size: 'small' | 'large' | 'normal';
}

export class AmqtbModal {
    readonly self: JQuery<HTMLElement>;
    readonly content: JQuery<HTMLElement>;

    constructor (opt: AmqtbModalOptions) {
        const cls = opt.class === undefined ? '' : opt.class;
        
        this.self = $(`<div class="modal fade" tabindex="-1" role="dialog"></div>`)
            .attr('id', opt.id)
            .addClass(cls);
        const dialog = $(`<div class="modal-dialog" role="document"></div>`);
        if (opt.size === 'small') {
            dialog.addClass('modal-sm');
        } else if (opt.size === 'large') {
            dialog.addClass('modal-lg');
        }
        const content = $(`<div class="modal-content"></div>`);
        const header = $(`<div class="modal-header"></div>`);
        const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`)
            .append($(`<span aria-hidden="true">×</span>`));
        const body = $(`<div class="modal-body"></div>`);
        
        this.self
        .append(
            dialog
            .append(
                content
                .append(
                    header
                    .append(closeIcon)
                )
                .append(body)
            )
        );
        if (opt.content instanceof AmqtbTabContainer) {
            const title = $(`<h4 class="modal-title">${opt.title}</h4>`);
            this.self.addClass('tab-modal');
            header.append(title);
            opt.content.self.insertAfter(header);
            body.append(opt.content.contentContainer);
        } else {
            const title = $(`<h2 class="modal-title">${opt.title}</h2>`);
            header.append(title);
            body.append(opt.content);
        }
        /* this.content = opt.content;
        this.self = $(`<div class="modal fade" tabindex="-1" role="dialog"></div>`)
            .attr('id', opt.id)
            .addClass(cls)
            .append($(`<div class="modal-dialog" role="document"></div>`)
                .append($(`<div class="modal-content"></div>`)
                    .append($(`<div class="modal-header"></div>`)
                        .append($(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`)
                            .append($(`<span aria-hidden="true">×</span>`))
                        )
                        .append($(`<h2 class="modal-title">${opt.title}</h2>`))
                    )
                    .append($(`<div class="modal-body" style="overflow-y: auto;max-height: calc(100vh - 150px);"></div>`)
                        .append(this.content)
                    )
                )
            ); */
        this.content = body;
        $("#gameContainer").append(this.self);
    }
}