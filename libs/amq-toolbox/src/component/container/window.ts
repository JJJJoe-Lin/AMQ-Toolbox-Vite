import { IComponent } from '../component';
import { Container, ContainerOpt, IContainer } from './container';

export interface WindowOpt extends ContainerOpt {
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

export interface IWindow extends IContainer<IComponent> {}

export class Window extends Container<IComponent> implements IWindow {
    private components = this.container;
    private content: JQuery<HTMLElement>;

    constructor (opt: WindowOpt) {
        super(opt);
        const title = opt.title;
        const width = opt.width;
        const height = opt.height;
        const resizable = opt.resizable === undefined ? true : opt.resizable;
        const draggable = opt.draggable === undefined ? true : opt.draggable;
        const minWidth = opt.minWidth === undefined ? opt.width : opt.minWidth;
        const minHeight = opt.minHeight === undefined ? opt.height : opt.minHeight;
        const position = opt.position === undefined ? { x: 0, y: 0 } : opt.position;
        const zIndex = opt.zIndex === undefined ? 1060 : opt.zIndex;
        this.self.addClass('amqtbWindow')
            .css("position", "absolute")
            .css("z-index", zIndex.toString())
            .offset({
                top: position.y !== undefined ? position.y : 0,
                left: position.x !== undefined ? position.x : 0,
            })
            .height(height)
            .width(width);
        
        const content = $(`<div class="amqtbWindowContent"></div>`);
        const header = $(`<div></div>`)
            .addClass("modal-header amqtbWindowHeader")
            .addClass(draggable === true ? "draggableWindow" : "")
            .append($(`<div class="close" type="button"><span aria-hidden="true">×</span></div>`)
                .on('click', () => {
                    this.hide();
                })
            )
            .append($(`<h2></h2>`)
                .addClass("modal-title")
                .text(title)
            );
        this.content = $(`<div class="modal-body amqtbWindowBody"></div>`)
            .addClass(resizable === true ? "resizableWindow" : "")
            .height(height - 75);
        content.append(header);
        content.append(this.content);
        if (resizable === true) {
            const resizers = $(
                `<div class="windowResizers">
                    <div class="windowResizer top-left"></div>
                    <div class="windowResizer top-right"></div>
                    <div class="windowResizer bottom-left"></div>
                    <div class="windowResizer bottom-right"></div>
                </div>`
            );
            this.self.append(resizers);
            let tmp = this;
            let startWidth = 0;
            let startHeight = 0;
            let startX = 0;
            let startY = 0;
            let startMouseX = 0;
            let startMouseY = 0;
            resizers.find(".windowResizer").each(function (index, resizer) {
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
                                tmp.content.height(newHeight - 103);
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
                                tmp.content.height(newHeight - 103);
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
                                tmp.content.height(newHeight - 103);
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
                                tmp.content.height(newHeight - 103);
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
                handle: header,
                containment: "#gameContainer"
            });
        }
        this.self.append(content);
        $("#gameContainer").append(this.self);
        this.hide();
    }

    protected appendComponent(component: IComponent): void {
        this.content.append(component.self);
    }
}