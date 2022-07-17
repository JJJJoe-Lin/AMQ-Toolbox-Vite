import styles from './style.css?inline';
import { AmqtbTab, AmqtbTabContainer } from '../tab/main';
import { AmqtbOptions } from '../option/main';
import { AmqtbModal } from '../modal/main'
import { AmqtbTable, AmqtbTableCell } from '../table/main';
import { deleteCookie, loadFromCookie, saveToCookie } from '../utils/cookies';

export interface Plugin {
    name: string;
    dependencies?: string[];
    enabled: boolean;
    view?: AmqtbViewBlock;
    options?: AmqtbOptions;
    settingTab?: AmqtbTab;
}

interface AmqtbViewBlockOptions {
    id?: string;
    class?: string;
    title: string;
    content: JQuery<HTMLElement>;
}

export class AmqtbViewBlock {
    self: JQuery<HTMLElement>;
    constructor (opt: AmqtbViewBlockOptions) {
        const id = opt.id === undefined ? '' : opt.id;
        const cls = opt.class === undefined ? '' : opt.class;
        this.self = $(`<div class="row"></div>`)
            .attr('id', id)
            .addClass(cls);
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

const PluginManageTableId = 'amqtbPluginManageTable';
interface PluginManageTableSchema {
    pluginName: string;
    enabled: boolean;
}

class PluginNameCell implements AmqtbTableCell<string> {
    elem: JQuery<HTMLElement>;
    constructor () {
        this.elem = $(`<p></p>`);
    }
    get value() {
        return this.elem.text();
    }
    set value(str: string) {
        this.elem.text(str);
    }
}

class EnabledCell implements AmqtbTableCell<boolean> {
    elem: JQuery<HTMLElement>;
    private switch: JQuery<HTMLElement>;
    private switchOn: JQuery<HTMLElement>;
    private switchOff: JQuery<HTMLElement>;
    
    constructor (enabled: boolean) {
        this.switchOff = $(`<div class="switchOff slider-tick round"></div>`);
        this.switchOn = $(`<div class="switchOn slider-tick round"></div>`);
        this.switch = $(`<div class="switchContainer slider-track"></div>`)
            .append($(`<div class="slider-tick-container"></div>`)
                .append(this.switchOff)
                .append(this.switchOn)
            );
        this.elem = $(`<div></div>`)
            .addClass(`${PluginManageTableId}EnabledCell`)
            .append(this.switch);
        if (enabled) {
            this.switchOff.hide();
            this.switch.addClass('active');
        } else {
            this.switchOn.hide();
            this.switch.removeClass('active');
        }
        this.switch.on('click', () => {
            this.value = !this.value;
        });
    }
    get value() {
        return this.switch.hasClass('active');
    }
    set value(val: boolean) {
        if (val !== this.value) {
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
    }
}

export class AMQ_Toolbox {
    // private settingWindow: AmqtbWindow;
    private settingModal: AmqtbModal;
    private viewBlocks: JQuery<HTMLElement>;
    private tabContainer: AmqtbTabContainer;
    private settingButton: JQuery<HTMLElement>;
    private optionsTab: AmqtbTab;
    private manageModal: AmqtbModal;
    private manageTable: AmqtbTable<PluginManageTableSchema>;
    private plugins: Plugin[];
    private oldPluginsInfo: PluginManageTableSchema[];
    
    constructor () {
        this.viewBlocks = $(`<div></div>`)
            .attr('id', 'qpToolboxContainer')
            .addClass('container floatingContainer');
        this.viewBlocks.insertBefore($(`#qpCheatTestCommands`));
        
        this.tabContainer = new AmqtbTabContainer();
        this.settingModal = new AmqtbModal({
            id: 'amqtbSettingModal',
            title: 'Toolbox Setting',
            size: 'normal',
            content: this.tabContainer,
        });
        this.optionsTab = new AmqtbTab({
            title: 'Option',
            name: 'optionsTab',
            containerClass: 'row',
        });
        this.tabContainer.add(this.optionsTab);
        this.tabContainer.select(this.optionsTab);

        this.settingButton = $(`<div></div>`)
            .attr('id', 'amqtbSettingButton')
            .addClass('clickAble qpOption')
            .append($(`<i></i>`)
                .addClass('fa fa-wrench')
                .addClass('qpMenuItem')
                .attr('aria-hidden', 'true'))
            .on('click', () => {
                this.settingModal.self.modal('show');
            })
            .popover({
                placement: 'bottom',
                content: 'Toolbox Setting',
                trigger: 'hover',
            });
        const oldWidth = $('#qpOptionContainer').width()!;
        $("#qpOptionContainer").width(oldWidth + 35);
        $("#qpOptionContainer > div").append(this.settingButton);

        this.plugins = [];
        this.manageTable = new AmqtbTable<PluginManageTableSchema>({
            id: PluginManageTableId,
            addable: false,
            deletable: false,
            movable: true,
            settable: true,
            fieldNames: ['pluginName', 'enabled'],
            newRow: () => {
                return {
                    pluginName: new PluginNameCell(),
                    enabled: new EnabledCell(true),
                };
            },
            onSave: (data) => {
                saveToCookie(PluginManageTableId, data);
            },
            onLoad: () => {
                return loadFromCookie(PluginManageTableId);
            },
        });
        this.manageTable.saveBtn!.self.on('click', () => {
            console.log('Refresh AMQ Toolbox');
            this.refresh();
            this.manageModal.self.modal('hide');
        });
        // this.oldPluginsInfo = GM_getValue(PluginManageTableId, []);
        // GM_deleteValue(PluginManageTableId);
        this.oldPluginsInfo = loadFromCookie(PluginManageTableId, []);
        deleteCookie(PluginManageTableId);
        this.manageTable.reset();
        this.manageModal = new AmqtbModal({
            id: 'amqtbManageModal',
            title: 'Toolbox Management',
            content: this.manageTable.self,
            size: 'normal',
        });
        
        $("#optionsContainer > ul").prepend(
            $(`<li class="clickAble" data-toggle="modal" data-target="#amqtbManageModal"></li>`)
                .text('Plugins')
        );
        $("#optionsContainer > ul").prepend(
            $(`<li class="clickAble" data-toggle="modal" data-target="#amqtbSettingModal"></li>`)
                .text('Toolbox Setting')
        );

        GM_addStyle(styles);
        console.log('New AMQ Toolbox created');
    }

    registerPlugin (plugin: Plugin): null | Error {
        if (plugin.dependencies && !this.checkDependency(plugin.dependencies)) {
            return new Error('Dependencies has not loaded');
        }

        this.plugins.push(plugin);
        const saveInfo = this.oldPluginsInfo.find(info => info.pluginName === plugin.name);
        if (saveInfo !== undefined) {
            plugin.enabled = saveInfo.enabled;
        }
        const newEntry: PluginManageTableSchema = {
            pluginName: plugin.name,
            enabled: plugin.enabled,
        } 
        const savedOrder = this.oldPluginsInfo.findIndex(info => info.pluginName === plugin.name);
        if (savedOrder !== -1) {
            newEntry.enabled = this.oldPluginsInfo[savedOrder].enabled;
            let added = false;
            for (let entry of this.manageTable.entries) {
                const order = this.oldPluginsInfo.findIndex(info => info.pluginName === entry.pluginName.value);
                if (order === undefined || savedOrder < order) {
                    this.manageTable.insertRowBefore(entry, newEntry);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.manageTable.appendRow(newEntry);
            }
        } else {
            this.manageTable.appendRow(newEntry);
        }
        this.manageTable.saveBtn!.self.trigger('click');
        console.log(`Register plugin: ${plugin.name}`);
        return null;
    }

    private refresh () {
        // detach elements
        this.viewBlocks.children().detach();
        this.tabContainer.hideAll();
        this.tabContainer.show(this.optionsTab);
        this.optionsTab.container.children('.col-xs-6').detach();
        // layout elements
        for (let info of this.manageTable.entries) {
            const plugin = this.plugins.find(p => p.name === info.pluginName.value);
            if (plugin === undefined) {
                // should not happen :(
                console.error('loaded Plugin: ',
                    this.plugins.map(p => p.name),
                    '\nentry in table: ',
                    info.pluginName.value);
            } else {
                plugin.enabled = info.enabled.value;
                if (plugin.enabled) {
                    if (plugin.view) {
                        this.viewBlocks.append(plugin.view.self);
                    }
                    if (plugin.settingTab) {
                        if (this.tabContainer.has(plugin.settingTab)) {
                            this.tabContainer.show(plugin.settingTab);
                        } else {
                            this.tabContainer.add(plugin.settingTab);
                        }
                    }
                    if (plugin.enabled && plugin.options) {
                        this.optionsTab.container.append(plugin.options.self);
                        this.settingModal.self.on('shown.bs.modal', () => {
                            plugin.options!.refresh();
                        });
                    }
                }
            }
        }
    }

    private checkDependency (dps: string[]): boolean {
        let ret = true;
        let pluginNames = this.plugins.map(p => p.name);
        dps.forEach(dp => {
            if (!pluginNames.includes(dp)) {
                ret = false;
            }
        });
        return ret;
    }
}
