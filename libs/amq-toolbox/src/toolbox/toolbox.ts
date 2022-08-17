import styles from './style.css?inline';
import {
    Switch,
    Text,
    View,
    ViewBlock
} from './component';
import {
    IComponent,
    Modal,
    Tab,
    Table,
    TabModal
} from '../component/main';
import { IPlugin } from '../plugin';


export class Toolbox {
    private readonly viewBlock;
    private readonly settingModal;
    private readonly optionTab;
    private readonly manageModal;
    private readonly pluginTable;
    private readonly prevPluginsInfo;
    private readonly plugins: Map<string, IPlugin>;

    constructor () {
        this.plugins = new Map();
        this.viewBlock = new ViewBlock({});
        this.viewBlock.self.insertBefore(`#qpCheatTestCommands`);
        // create option tab
        this.optionTab = new Tab({
            tabName: 'Option',
            contentClass: 'row',
        });
        // create settingModal
        this.settingModal = new TabModal({
            title: 'Toolbox Setting',
            id: 'amqtbSettingModal',
            size: 'normal',
        });
        this.settingModal.self.on('shown.bs.modal', () => {
            for (let plugin of this.plugins.values()) {
                if (plugin.enabled() && plugin.options) {
                    plugin.options.refresh();
                }
            }
        });
        $("#gameContainer").append(this.settingModal.self);
        this.settingModal.push(this.optionTab);
        // create setting button
        const settingBtn: IComponent = {
            self: $(`<div></div>`)
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
            }),
        };
        const oldWidth = $('#qpOptionContainer').width()!;
        $("#qpOptionContainer").width(oldWidth + 35);
        $("#qpOptionContainer > div").append(settingBtn.self);
        // create manage modal (plugin table)
        this.manageModal = new Modal({
            title: 'Toolbox Management',
            id: 'amqtbManageModal',
            size: 'normal',
        });
        this.pluginTable = new Table({
            name: 'amqtbPluginManageTable',
            addOrDeletable: false,
            movable: true,
            savable: true,
            saveIn: 'LocalStorage',
            newRow: () => ({
                pluginName: new Text(),
                enabled: new Switch(),
            }),
        });
        this.manageModal.push(this.pluginTable);
        // set reload listener
        const saveBtn = this.pluginTable.getButton('save')!;
        saveBtn.self.on('click', () => {
            console.log('[Toolbox] Reload plugins');
            this.reload();
            this.manageModal.hide();
        });
        // get previous plugin info and reset
        this.pluginTable.load();
        this.prevPluginsInfo = this.pluginTable.getValue();
        this.pluginTable.splice(0);
        this.pluginTable.save();
        // create setting menu for settingModal and manageModal
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

    addPlugin (plugin: IPlugin): void {
        if (plugin.dependencies && !this.checkDependency(plugin.dependencies)) {
            throw new Error('Dependencies has not loaded');
        }
        this.plugins.set(plugin.name, plugin);
        const prevOrder = this.prevPluginsInfo.findIndex(info => info.pluginName === plugin.name);
        if (prevOrder !== -1) {
            if (this.prevPluginsInfo[prevOrder].enabled) {
                plugin.enable();
            } else {
                plugin.disable();
            }
        }
        const pluginInfos = this.pluginTable.getValue();
        const newRow = this.pluginTable.createRow({
            pluginName: plugin.name,
            enabled: plugin.enabled(),
        });
        let insertIdx = pluginInfos.length;
        if (prevOrder !== -1) {
            for (let [idx, pluginInfo] of pluginInfos.entries()) {
                const order = this.prevPluginsInfo.findIndex(info => info.pluginName === pluginInfo.pluginName);
                if (order === -1 || prevOrder < order) {
                    insertIdx = idx;
                    break;
                }
            }
        }
        if (insertIdx === pluginInfos.length) {
            this.pluginTable.append(newRow);
        } else {
            this.pluginTable.splice(insertIdx, 0, newRow);
        }
        this.pluginTable.save();
        this.reload();
        console.log(`[Toolbox] Register plugin: ${plugin.name}`);
    }

    private reload(): void {
        // reset containers
        this.viewBlock.clear();
        this.optionTab.clear();
        this.settingModal.clear();
        this.settingModal.push(this.optionTab);
        // layout components
        const pluginInfos = this.pluginTable.getValue();
        for (let pluginInfo of pluginInfos) {
            const plugin = this.plugins.get(pluginInfo.pluginName);
            if (plugin === undefined) {
                console.error(`plugins:`, this.plugins, `table:`, pluginInfos);
                throw new Error(`Reload Error`);
            }
            if (pluginInfo.enabled) {
                plugin.enable();
                if (plugin.view) {
                    this.viewBlock.push(new View({
                        title: plugin.name,
                        content: plugin.view.self,
                    }));
                }
                if (plugin.options) {
                    this.optionTab.push(plugin.options);
                }
                if (plugin.settingTab) {
                    this.settingModal.push(plugin.settingTab);
                }
            } else {
                plugin.disable();
            }
        }
    }

    private checkDependency (dps: string[]): boolean {
        let pluginNames = [...this.plugins.keys()];
        dps.forEach(dp => {
            if (!pluginNames.includes(dp)) {
                return false;
            }
        });
        return true;
    }
}
