import {
    AmqtbButton,
    AmqtbButtonContainer,
    AmqtbTab,
    AmqtbViewBlock,
    AMQ_Toolbox,
    Plugin,
} from 'amq-toolbox';
import { AmqtbTable, AmqtbTableCell } from 'amq-toolbox/src/table/main';

declare var amqToolbox: AMQ_Toolbox;

interface SettingTableSchema {
    displayName: string;
    animeName: string;
}

class TextInputCell implements AmqtbTableCell<string> {
    elem: JQuery<HTMLElement>;

    constructor (val?: string, placeholder?: string) {
        this.elem = $(`<input class="form-control input-sm" type="text"></input>`)
            .attr('placeholder', placeholder === undefined ? '' : placeholder)
            .val(val === undefined ? '' : val);
    }

    get value() {
        const ret = this.elem.val();
        if (ret === undefined) {
            return '';
        } else {
            return ret.toString();
        }
    }

    set value(val: string) {
        this.elem.val(val);
    }
}

class QuickAnswer implements Plugin {
    name = 'Quick Answer';
    settingTab: AmqtbTab | undefined;
    view: AmqtbViewBlock | undefined;
    private _enabled = false;
    private settingTable: AmqtbTable<SettingTableSchema>;
    private btnContainer: AmqtbButtonContainer;

    constructor() {
        this.settingTab = new AmqtbTab({
            title: 'Quick Answer',
        });
        this.settingTable = new AmqtbTable({
            id: 'amqtbQuickAnsSettingTable',
            fieldNames: ['displayName', 'animeName'],
            addable: true,
            deletable: true,
            movable: true,
            settable: true,
            title: 'Quick Answer List',
            newRow: () => {
                return {
                    displayName: new TextInputCell(),
                    animeName: new TextInputCell(),
                };
            },
        });
        this.settingTab.container.append(this.settingTable.self);
        this.settingTable.saveBtn!.self.on('click', () => {
            this.loadBtn();
        });
        
        this.btnContainer = new AmqtbButtonContainer({});
        this.view = new AmqtbViewBlock({
            title: 'Quick Answer',
            content: this.btnContainer.self,
        });
        this.loadBtn();
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val: boolean) {
        this._enabled = val;
    }

    private loadBtn() {
        this.btnContainer.clear();
        for (let entry of this.settingTable.entries) {
            const btn = new AmqtbButton({
                label: entry.displayName.value,
                name: entry.animeName.value,
                size: 'extra-small',
                style: 'primary',
            });
            btn.self.on('click', () => {
                const input = $('#qpAnswerInput');
                if (input.prop('disabled')) {
                    return false;
                }
                input.prop('value', entry.animeName.value);
                submitAnswer();
            });
            this.btnContainer.add(btn);
        }
    }
}

function submitAnswer() {
    var e = jQuery.Event("keypress");
    e.which = 13;       // Enter
    e.keyCode = 13;
    $('#qpAnswerInput').trigger(e);
}

function setup() {
    if ((unsafeWindow as any).amqToolbox === undefined) {
        (unsafeWindow as any).amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new QuickAnswer();
    const err = amqToolbox.registerPlugin(plugin);
    if (err) {
        console.error(err);
        plugin.enabled = false;
        return;
    }
}

function main() {
    if (document.getElementById('startPage')) return;
    let loadInterval = setInterval(() => {
        if ($('#loadingScreen').hasClass('hidden')) {
            try {
                setup();
            } finally {
                clearInterval(loadInterval);
            }
            clearInterval(loadInterval);
        }
    }, 500);
}

$(main);