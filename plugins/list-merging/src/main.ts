import {
    IPlugin,
    ITab,
    MultiSelect,
    onStartPageLoaded,
    registerPlugin,
    SingleSelect,
    Tab,
    Table,
    TextInput
} from 'amq-toolbox';
import { AnimeListSite, Entry, redirectPathName, redirectURLHandler, Status } from 'anime-list';
import { EntrySet, Included } from './animeEntries';
import { AnimeListAccount } from './component';
import './style.css';

declare var displayMessage: (title: string, msg: string, callback?: Function) => void;

class ListMerging implements IPlugin {
    public name = 'List Merging';
    public settingTab?: ITab | undefined;
    private _enabled = false;
    private account;
    private site;
    private status;
    private mergedLists;
    
    constructor() {
        this.settingTab = new Tab({
            tabName: 'Custom List',
            contentClass: 'amqtb-list-merging-tab row',
        });
        const accountTitle = $('<div class="col-xs-12"></div>')
            .append($('<h4><b>Target Account</b></h4>')
                .css('text-align', 'center')
            );
        this.settingTab.push({self: accountTitle});

        this.account = new AnimeListAccount(); 
        // create site choose selection
        const siteChooseBlock = $('<div class="col-xs-3"></div>')
            .css('text-align', 'center');
        this.site = new SingleSelect<AnimeListSite>({
            label: 'Site',
            choices: [
                {label: 'MyAnimeList', value: 'MyAnimeList'},
                {label: 'AniList', value: 'AniList'},
                {label: 'Kistu', value: 'Kitsu'},
            ],
        });
        const options = this.site.self.find('ul > li > a');
        options.eq(0).on('click', () => {this.account.show('MyAnimeList')});
        options.eq(1).on('click', () => {this.account.show('AniList')});
        options.eq(2).on('click', () => {this.account.show('Kitsu')});
        siteChooseBlock.append(this.site.self);
        this.settingTab.push({self: siteChooseBlock});
        // create status choose selection
        const statusChooseBlock = $('<div class="col-xs-3"></div>')
            .css('text-align', 'center');
        this.status = new SingleSelect<Status>({
            label: 'Status',
            choices: [
                {label: 'Watching', value: 'Watching'},
                {label: 'Completed', value: 'Completed'},
                {label: 'On Hold', value: 'On-Hold'},
                {label: 'Dropped', value: 'Dropped'},
                {label: 'Planning', value: 'Plan to Watch'},
            ],
        });
        statusChooseBlock.append(this.status.self);
        this.settingTab.push({self: statusChooseBlock});
        this.settingTab.push(this.account);
        
        // create table
        const tableBlock = $('<div class="col-xs-12"></div>');
        this.mergedLists = new Table({
            name: 'Merged List',
            title: 'Lists To Be Merged',
            addOrDeletable: true,
            movable: false,
            saveIn: 'Script',
            newRow: () => ({
                accountType: new SingleSelect<AnimeListSite>({
                    label: 'Choose a type',
                    choices: [
                        {label: 'MAL Username', value: 'MyAnimeList'},
                        {label: 'AniList Username', value: 'AniList'},
                        {label: 'Kitsu ID', value: 'Kitsu'},
                    ],
                }),
                user: new TextInput({placeholder: 'username/ID'}),
                status: new MultiSelect<Status>({
                    label: 'Status',
                    choices: [
                        {label: 'Watching', value: 'Watching'},
                        {label: 'Completed', value: 'Completed'},
                        {label: 'On Hold', value: 'On-Hold'},
                        {label: 'Dropped', value: 'Dropped'},
                        {label: 'Planning', value: 'Plan to Watch'},
                    ],
                }),
                included: new SingleSelect<Included | 'Skip'>({
                    label: '',
                    choices: [
                        {label: 'Optional', value: 'Optional'},
                        {label: 'Include', value: 'Include'},
                        {label: 'Exclude', value: 'Exclude'},
                        {label: 'Skip', value: 'Skip'},
                    ],
                }),
            }),
        });
        const saveBtn = this.mergedLists.getButton('save')!;
        const saveLabel = saveBtn.self.text();
        saveBtn.self.html(`${saveLabel}<i class="fa fa-spinner fa-spin hide"></i>`);
        const spinner = saveBtn.self.find('i');
        saveBtn.self.on('click', async () => {
            spinner.removeClass('hide');
            const err = await this.mergeLists();
            spinner.addClass('hide');
            if (err) {
                displayMessage('Merge Failed', err.message);
            } else {
                displayMessage('Merge Successful', 'The lists has been merged to the target');
            }
        });
        tableBlock.append(this.mergedLists.self);
        this.settingTab.push({self: tableBlock});
        
        this.enable();
    }
    enable(): void { this._enabled = true; }
    disable(): void { this._enabled = false; }
    enabled(): boolean { return this._enabled; }
    
    private async mergeLists(): Promise<null | Error> {
        const site = this.site.getValue();
        const status = this.status.getValue();
        if (site === undefined || status === undefined) {
            return new Error('missing some target account information');
        }
        const account = this.account.getAccount(site);
        console.log(`[mergeLists] get merged entries`);
        const entries = await this.getMergedEntries();
        if (entries instanceof Error) {
            return new Error(`failed to merge lists: ${entries}`);
        }
        for (let entry of entries) { entry.status = status; }
        console.log(`[mergeLists] delete target's '${status}' list`);
        let err = await account.deleteList([status]);
        if (err) {
            return new Error(`failed to delete entries of target: ${err}`);
        }
        console.log(`[mergeLists] import merged entries to target`);
        err = await account.importList(entries, false);
        if (err) {
            return new Error(`failed to import entries to target: ${err}`);
        }
        return null;
    }
    
    private async getMergedEntries(): Promise<Entry[] | Error> {
        const entrySet = new EntrySet();
        const mergedLists = this.mergedLists.getValue();
        for (let list of mergedLists) {
            if (list.accountType === undefined || !list.user || list.included === undefined) {
                return new Error('missing some list information');
            } else if (list.status.length === 0 || list.included === 'Skip') {
                continue;
            }
            console.log(`[getMergedEntries] get ${list.user} List`);
            let entries: Error | Entry[];
            if (list.accountType === 'Kitsu') {
                entries = await this.account.getAccount(list.accountType).getList(
                    {id: parseInt(list.user, 10)},
                    list.status,
                );
            } else {
                entries = await this.account.getAccount(list.accountType).getList(
                    {name: list.user},
                    list.status,
                );
            }
            if (entries instanceof Error) {
                return new Error(`Failed to get [${list.accountType}]${list.user}'s list: ${entries}`);
            }
            entrySet.update(entries, list.included);
        }
        return entrySet.getResult();
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new ListMerging());
    });
}

const path = new URL(document.URL);
if (path.pathname === redirectPathName) {
    redirectURLHandler();
} else {
    $(main);
}