import {
    CheckboxOption,
    IPlugin,
    Options,
    RadioOption,
    onStartPageLoaded,
    registerPlugin
} from 'amq-toolbox';
import {
    CustomFzf,
    FzfAmqAwesomplete,
    FzfEvaluate
} from './FZF_AmqAwesomeplete';

// Fake AMQ object type define
interface AmqAwesomepleteConstructor {
    new (input: any, o: any, scrollable: any): any;
    prototype: any;
}
declare var AmqAwesomeplete: AmqAwesomepleteConstructor;
declare var autoCompleteController: any;

type MatchMethod = 'Origin' | 'FZF';

class CustomAutocomplete implements IPlugin {
    public name = 'Custom Autocomplete';
    public options;
    private _enabled = false;
    private _FZFAwesomeplete: AmqAwesomepleteConstructor;
    private _originCreateNewInstance: ($input: any) => void;
    private _customCreateNewInstance: ($input: any) => void;
    private _cachedList: any[] | null = null;
    private _cachedListLength = -1;
    private _cachedFzf: CustomFzf | null = null;
    
    constructor() {
        // create options
        this.options = new Options({
            title: this.name,
        });
        this.options.push(new CheckboxOption({
            name: 'autoFirst',
            inputId: 'amqtbCustomAutocmpleteAutoFirst',
            label: 'Auto select the first matched answer',
            offset: 0,
            saveIn: 'Script',
            defaultValue: false,
        }));
        this.options.push(new CheckboxOption({
            name: 'redo',
            inputId: 'amqtbCustomAutocmpleteRedo',
            label: 'Can redo after select a answer (experimental)',
            offset: 0,
            saveIn: 'Script',
            defaultValue: false,
            description: 'Can use Ctrl-Z to return to the last input even if a answer was selected.(Disable this if any Compatibility issues)'
        }));
        this.options.push(new RadioOption<MatchMethod>({
            name: 'matchMethod',
            inputId: 'amqtbDownloaderAutoDlMediaType',
            label: 'Match Algorithm',
            saveIn: 'Script',
            offset: 0,
            choices: [
                {
                    label: 'Origin(AMQ)',
                    value: 'Origin',
                },
                {
                    label: 'FZF',
                    value: 'FZF',
                },
            ],
            defaultValue: 'Origin',
        }));

        // setup FZF Awesomeplete
        this._FZFAwesomeplete = FzfAmqAwesomplete;
        this._FZFAwesomeplete.prototype = Object.create(AmqAwesomeplete.prototype);
        this._FZFAwesomeplete.prototype.constructor = FzfAmqAwesomplete;
        this._FZFAwesomeplete.prototype.evaluate = FzfEvaluate;

        // backup origin createNewInstance function
        this._originCreateNewInstance = autoCompleteController.createNewInstance;
        // setup custom createNewInstance function
        this._customCreateNewInstance = ($input: any) => {
            let acc = autoCompleteController;
            let autoFirst: boolean = this.options.get('autoFirst')!.getValue();
            let redoOpt: boolean = this.options.get('redo')!.getValue();
            let matchMethod: MatchMethod = this.options.get('matchMethod')!.getValue();

            console.log('[Custom Autocomplete] Do custom createNewInstance()');
            let instance: any;
            // create new instance
            if (matchMethod === 'Origin') {
                instance = new AmqAwesomeplete($input[0],
                    {
                        list: acc.list,
                        minChars: 1,
                        maxItems: 25
                    },
                    true);
            } else if (matchMethod === 'FZF') {
                instance = new this._FZFAwesomeplete($input[0],
                    {
                        list: acc.list,
                        minChars: 1,
                        maxItems: 25,
                        customFzf: this.getCustomFzf(acc.list),
                    },
                    true);
            }
            if (!instance) {
                return;
            }
            // setup replace method
            if (redoOpt) {
                instance.once_disable_evaluate = false;
                instance.replace = function (suggestion: any) {
                    (this as any).input.focus();
                    (this as any).input.select();
                    (this as any).once_disable_evaluate = true;
                    document.execCommand('insertText', false, suggestion.value);
                };
            }
            // setup autoFirst
            instance.autoFirst = autoFirst;
            acc.awesomepleteInstances.push(instance);
        };

        // option callback
        this.options.get('autoFirst')!.input.on('click', () => {
            let opt = this.options.get('autoFirst')!.getValue();
            for (let instance of autoCompleteController.awesomepleteInstances) {
                instance.autoFirst = opt;
            }
        });
        this.options.get('redo')!.input.on('click', () => {this.updateAutoComplete()});
        this.options.get('matchMethod')!.input.on('change', () => {this.updateAutoComplete()});
    }
    enable(): void {
        this._enabled = true;
        autoCompleteController.createNewInstance = this._customCreateNewInstance;
        this.updateAutoComplete();
    }
    disable(): void {
        this._enabled = false;
        autoCompleteController.createNewInstance = this._originCreateNewInstance;
        this.updateAutoComplete();
    }
    enabled(): boolean {
        return this._enabled;
    }
    private getCustomFzf(list: any[]): CustomFzf {
        if (!this._cachedFzf || this._cachedList !== list || this._cachedListLength !== list.length) {
            this._cachedList = list;
            this._cachedListLength = list.length;
            this._cachedFzf = new CustomFzf(list);
        }
        return this._cachedFzf;
    }
    private updateAutoComplete() {
        if (autoCompleteController.version !== null || autoCompleteController.awesomepleteInstances.length > 0) {
            autoCompleteController.newList();
        }
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new CustomAutocomplete());
    });
}

$(main);