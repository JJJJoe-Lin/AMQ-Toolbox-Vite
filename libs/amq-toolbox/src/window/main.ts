interface AmqtbWindowOptions {
    id?: string;
    class?: string;
    title: string;
    width: number;
    height: number;
    resizable?: boolean;
    draggable?: boolean;
    minWidth?: number;
    minHeight?: number;
    position?: { x: number, y: number };
    zIndex?: number;
}

export class AmqtbWindow {
    self: JQuery<HTMLElement>;
    content: JQuery<HTMLElement>;
    header: JQuery<HTMLElement>;
    body: JQuery<HTMLElement>;
    resizers?: JQuery<HTMLElement>;

    constructor(opt: AmqtbWindowOptions) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        const title = opt.title;
        const width = opt.width;
        const height = opt.height;
        const resizable = opt.resizable === undefined ? true : opt.resizable;
        const draggable = opt.draggable === undefined ? true : opt.draggable;
        const minWidth = opt.minWidth === undefined ? opt.width : opt.minWidth;
        const minHeight = opt.minHeight === undefined ? opt.height : opt.minHeight;
        const position = opt.position === undefined ? { x: 0, y: 0 } : opt.position;
        const zIndex = opt.zIndex === undefined ? 1060 : opt.zIndex;

        this.self = $(`<div></div>`)
            .addClass('amqtbWindow')
            .addClass(cls)
            .attr("id", id)
            .css("position", "absolute")
            .css("z-index", zIndex.toString())
            .offset({
                top: position.y !== undefined ? position.y : 0,
                left: position.x !== undefined ? position.x : 0,
            })
            .height(height)
            .width(width);

        this.content = $(`<div class="amqtbWindowContent"></div>`);
        this.header = $(`<div></div>`)
            .addClass("modal-header amqtbWindowHeader")
            .addClass(draggable === true ? "draggableWindow" : "")
            .append($(`<div class="close" type="button"><span aria-hidden="true">×</span></div>`)
                .click(() => {
                    this.close();
                })
            )
            .append($(`<h2></h2>`)
                .addClass("modal-title")
                .text(title)
            );
        this.body = $(`<div class="modal-body amqtbWindowBody"></div>`)
            .addClass(resizable === true ? "resizableWindow" : "")
            .height(height - 75);
        this.content.append(this.header);
        this.content.append(this.body);
        if (resizable === true) {
            this.resizers = $(
                `<div class="windowResizers">
                    <div class="windowResizer top-left"></div>
                    <div class="windowResizer top-right"></div>
                    <div class="windowResizer bottom-left"></div>
                    <div class="windowResizer bottom-right"></div>
                </div>`
            );
            this.self.append(this.resizers);
            let tmp = this;
            let startWidth = 0;
            let startHeight = 0;
            let startX = 0;
            let startY = 0;
            let startMouseX = 0;
            let startMouseY = 0;
            this.resizers.find(".windowResizer").each(function (index, resizer) {
                $(resizer).mousedown(function (event) {
                    tmp.self.css("user-select", "none");
                    startWidth = tmp.self.width()!;
                    startHeight = tmp.self.height()!;
                    startX = tmp.self.position().left;
                    startY = tmp.self.position().top;
                    startMouseX = event.originalEvent!.clientX;
                    startMouseY = event.originalEvent!.clientY;
                    let curResizer = $(this);
                    $(document.documentElement).mousemove(function (event) {
                        if (curResizer.hasClass("bottom-right")) {
                            let newWidth = startWidth + (event.originalEvent!.clientX - startMouseX);
                            let newHeight = startHeight + (event.originalEvent!.clientY - startMouseY);
                            if (newWidth > minWidth) {
                                tmp.self.width(newWidth);
                            }
                            if (newHeight > minHeight) {
                                tmp.body.height(newHeight - 103);
                                tmp.self.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("bottom-left")) {
                            let newWidth = startWidth - (event.originalEvent!.clientX - startMouseX);
                            let newHeight = startHeight + (event.originalEvent!.clientY - startMouseY);
                            let newLeft = startX + (event.originalEvent!.clientX - startMouseX);
                            if (newWidth > minWidth) {
                                tmp.self.width(newWidth);
                                tmp.self.css("left", newLeft + "px");
                            }
                            if (newHeight > minHeight) {
                                tmp.body.height(newHeight - 103);
                                tmp.self.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("top-right")) {
                            let newWidth = startWidth + (event.originalEvent!.clientX - startMouseX);
                            let newHeight = startHeight - (event.originalEvent!.clientY - startMouseY);
                            let newTop = startY + (event.originalEvent!.clientY - startMouseY);
                            if (newWidth > minWidth) {
                                tmp.self.width(newWidth);
                            }
                            if (newHeight > minHeight) {
                                tmp.self.css("top", newTop + "px");
                                tmp.body.height(newHeight - 103);
                                tmp.self.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("top-left")) {
                            let newWidth = startWidth - (event.originalEvent!.clientX - startMouseX);
                            let newHeight = startHeight - (event.originalEvent!.clientY - startMouseY);
                            let newLeft = startX + (event.originalEvent!.clientX - startMouseX);
                            let newTop = startY + (event.originalEvent!.clientY - startMouseY);
                            if (newWidth > minWidth) {
                                tmp.self.width(newWidth);
                                tmp.self.css("left", newLeft + "px");
                            }
                            if (newHeight > minHeight) {
                                tmp.self.css("top", newTop + "px");
                                tmp.body.height(newHeight - 103);
                                tmp.self.height(newHeight);
                            }
                        }
                    });
                    $(document.documentElement).mouseup(function (event) {
                        $(document.documentElement).off("mousemove");
                        $(document.documentElement).off("mouseup");
                        tmp.self.css("user-select", "text");
                    });
                });
            });
        }
        if (draggable === true) {
            this.self.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }
        this.self.append(this.content);
        $("#gameContainer").append(this.self);
    }

    open () {
        this.self.show();
    }

    close () {
        this.self.hide();
    }

    isVisible () {
        return this.self.is(":visible");
    }
}
