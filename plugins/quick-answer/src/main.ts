import {
    Button,
    Buttons,
    IPlugin,
    onStartPageLoaded,
    registerPlugin,
    Tab,
    Table,
    TextInput,
} from 'amq-toolbox';

class QuickAnswer implements IPlugin {
    public name = 'Quick Answer';
    public settingTab;
    public view;
    private _enabled = false;
    private settingTable;

    constructor() {
        this.settingTab = new Tab({
            tabName: 'Quick Answer',
        });
        this.settingTable = new Table({
            name: 'amqtbQuickAnsSettingTable',
            title: 'Quick Answer List',
            addOrDeletable: true,
            movable: true,
            saveIn: 'Script',
            newRow: () => ({
                displayName: new TextInput({placeholder: 'Display Name'}),
                animeName: new TextInput({placeholder: 'Anime Name'}),
            }),
        });
        this.settingTable.getButton('save')!.self.on('click', () => {
            this.loadBtn();
        });
        this.settingTab.push(this.settingTable);
        this.view = new Buttons({});
        this.loadBtn();
        this.enable();
    }

    public enable(): void {
        this._enabled = true;
    }

    public disable(): void {
        this._enabled = false;
    }

    public enabled(): boolean {
        return this._enabled;
    }

    private loadBtn() {
        this.view.clear();
        for (let entry of this.settingTable.getValue()) {
            const btn = new Button({
                label: entry.displayName,
                size: 'extra-small',
                style: 'primary',
            });
            btn.self.on('click', () => {
                const input = $('#qpAnswerInput');
                if (input.prop('disabled')) {
                    return false;
                }
                input.prop('value', entry.animeName);
                submitAnswer();
            });
            this.view.push(btn);
        }
    }
}

function submitAnswer() {
    var e = jQuery.Event("keypress");
    e.which = 13;       // Enter
    e.keyCode = 13;
    $('#qpAnswerInput').trigger(e);
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new QuickAnswer());
    });
}

$(main);