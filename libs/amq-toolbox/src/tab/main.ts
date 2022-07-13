import { AmqtbTab } from './tab';

export class AmqtbTabContainer {
    self: JQuery<HTMLElement>;
    contentContainer: JQuery<HTMLElement>;
    private curTab?: AmqtbTab;
    private readonly tabs: Map<string, AmqtbTab>;
    
    constructor () {
        this.self = $(`<div class="tabContainer"></div>`);
        this.contentContainer = $(`<div></div>`);
        this.tabs = new Map();
    }

    private selectTab (tab: AmqtbTab) {
        if (this.curTab !== undefined) {
            this.curTab.self.removeClass('selected');
            this.curTab.container.addClass('hide');
        }
        tab.self.addClass('selected');
        tab.container.removeClass('hide');
        this.curTab = tab;
    }

    add (...tabs: AmqtbTab[]) {
        for (let tab of tabs) {
            if (tab.name) {
                if (this.tabs.has(tab.name)) {
                    console.warn(`Skip adding duplicated tab '${tab.name}' in this container`);
                    continue;
                }
                this.tabs.set(tab.name, tab);
            }
            tab.self.on('click', () => {
                this.selectTab(tab);
            });
            this.self.append(tab.self);
            this.contentContainer.append(tab.container);
        }
    }

    has (tab: string | AmqtbTab) {
        if (typeof tab === 'string') {
            return this.tabs.has(tab);
        } else {
            return tab.name === undefined ? false : this.tabs.has(tab.name);
        }
    }

    get (tab: string | AmqtbTab) {
        if (typeof tab === 'string') {
            return this.tabs.get(tab);
        } else {
            return tab.name === undefined ? undefined : this.tabs.get(tab.name);
        }
    }

    select (tab: string | AmqtbTab) {
        if (this.has(tab)) {
            const _tab = this.get(tab)!;
            this.selectTab(_tab);
        }
    }

    hide (tab: string | AmqtbTab) {
        if (this.has(tab)) {
            const _tab = this.get(tab)!;
            _tab.self.addClass('hide');
            _tab.container.addClass('hide');
            if (this.curTab === _tab) {
                const existTab = [...this.tabs.values()].find(t => !t.self.hasClass('hide'));
                if (existTab === undefined) {
                    this.curTab.self.removeClass('selected');
                    this.curTab = undefined;
                } else {
                    this.selectTab(existTab);
                }
            }
        }
    }

    hideAll () {
        if (this.curTab !== undefined) {
            this.curTab.self.removeClass('selected');
            this.curTab = undefined;
        }
        for (let tab of this.tabs.values()) {
            this.hide(tab);
        }
    }

    show (tab: string | AmqtbTab) {
        if (this.has(tab)) {
            const _tab = this.get(tab)!;
            _tab.self.removeClass('hide');
            if (this.curTab === undefined) {
                this.selectTab(_tab);
            }
        }
    }

    get contents() {
        return [...this.tabs.values()].map(tab => tab.container);
    }
}

export * from './tab';
