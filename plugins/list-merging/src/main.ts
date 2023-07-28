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
declare var displayHtmlMessage: (title: string, html: string, buttonText: string, callback?: Function) => void;

interface MergeResult {
    entries: Entry[];
    errors: Error[];
}

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
            const errMessage = await this.mergeLists();
            spinner.addClass('hide');
            if (errMessage) {
                displayHtmlMessage('Merge Failed', errMessage, "OK");
            } else {
                displayHtmlMessage('Merge Successful', 'The lists has been merged to the target', "OK");
            }
        });
        tableBlock.append(this.mergedLists.self);
        this.settingTab.push({self: tableBlock});
        
        this.enable();
    }
    enable(): void { this._enabled = true; }
    disable(): void { this._enabled = false; }
    enabled(): boolean { return this._enabled; }
    
    private async mergeLists(): Promise<null | string> {
        const site = this.site.getValue();
        const status = this.status.getValue();
        if (site === undefined || status === undefined) {
            return 'Missing target account information';
        }
        const account = this.account.getAccount(site);
        if (!account.logined()) {
            return 'You should login target account first';
        }
        // Get merged entries from source lists
        console.log(`[List Merging] Get merged entries from source lists`);
        const result = await this.getMergedEntries();
        if (result.entries.length == 0 && result.errors.length != 0) {
            return `<p><b>Failed to merge lists:</b></p>${genErrorMessage(result.errors)}`;
        } else if (result.entries.length == 0) {
            return 'No entry to be import';
        }
        // Delete target list in "status"
        console.log(`[List Merging] Delete target's '${status}' list`);
        let err = await account.deleteList([status]);
        if (err) {
            return `<p>Failed to delete entries of target:</p><p>${err.message}</p>`;
        }
        // Import entries to target list
        for (let entry of result.entries) { entry.status = status; }
        console.log(`[List Merging] Import merged entries to target`);
        err = await account.importList(result.entries, false);
        if (err) {
            return `<p>Failed to import entries to target:</p><p>${err.message}</p>`;
        }
        if (result.errors.length != 0) {
            return `<p><b>Merge done, but some lists are skipped:</b></p>${genErrorMessage(result.errors)}`;
        }
        return null;
    }
    
    private async getMergedEntries(): Promise<MergeResult> {
        const entrySet = new EntrySet();
        const mergedLists = this.mergedLists.getValue();
        const ret: MergeResult = {
            entries: [],
            errors: [],
        };
        for (let list of mergedLists) {
            if (list.accountType === undefined || !list.user || list.included === undefined) {
                ret.errors.push(new Error('Missing some list information'));
                return ret;
            }
        }
        for (let list of mergedLists) {
            if (list.status.length === 0 || list.included === 'Skip' || list.included === undefined) {
                continue;
            }
            // Get List
            console.log(`[getMergedEntries] get ${list.user} List`);
            let entries: Error | Entry[];
            if (list.accountType === 'Kitsu') {
                entries = await this.account.getAccount(list.accountType).getList(
                    {id: parseInt(list.user, 10)},
                    list.status,
                );
            } else {
                entries = await this.account.getAccount(list.accountType!).getList(
                    {name: list.user},
                    list.status,
                );
            }
            // Check Error
            if (entries instanceof Error) {
                // Skip this list if has error during getList
                entries.message = `❌ Failed to get ${list.user}'s ${list.accountType} list:<br>${entries.message}`;
                ret.errors.push(entries);
                continue;
            } else {
                // Check each entry has malID, otherwise skip this list
                let isError = false;
                for (let entry of entries) {
                    if (entry.malID === 0) {
                        ret.errors.push(new Error(`❌ Anime "${entry.title}" has no MAL ID in ${list.user}'s ${list.accountType} list`));
                        isError = true;
                    }
                }
                if (isError) {
                    continue;
                } else {
                    entrySet.update(entries, list.included);
                }
            }
        }
        ret.entries = entrySet.getResult();
        return ret;
    }
}

function genErrorMessage(errs: Error[]): string {
    let ret = "";
    for (let err of errs) {
        ret += `<p>${err.message}</p>`;
    }
    return ret;
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