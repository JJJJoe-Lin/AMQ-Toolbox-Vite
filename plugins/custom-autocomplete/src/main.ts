import {
    CheckboxOption,
    IPlugin,
    Options,
    RadioOption,
    onStartPageLoaded,
    registerPlugin
} from 'amq-toolbox';
import {
    FzfAmqAwesomplete,
    FzfEvaluate
} from './FZF_AmqAwesomeplete';

// Fake AMQ object type define
interface AmqAwesomepleteConstructor {
    new (input: any, o: any, scrollable: any): any;
}
declare var AmqAwesomeplete: AmqAwesomepleteConstructor;
declare var Awesomplete: Function;
declare var quiz: any;

type MatchMethod = 'Origin' | 'FZF';

class CustomAutocomplete implements IPlugin {
    public name = 'Custom Autocomplete';
    public options;
    private _enabled = false;
    private _FZFAwesomeplete: AmqAwesomepleteConstructor;
    private _originNewList: Function;
    private _customNewList: Function;
    
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
        this._FZFAwesomeplete.prototype = Object.create(Awesomplete.prototype);
        this._FZFAwesomeplete.prototype.constructor = FzfAmqAwesomplete;
        this._FZFAwesomeplete.prototype.evaluate = FzfEvaluate;
        
        // backup origin newList fuction
        this._originNewList = quiz.answerInput.typingInput.autoCompleteController.newList;
        // setup custom newList function
        this._customNewList = () => {
            let acc = quiz.answerInput.typingInput.autoCompleteController;
            let autoFirst: boolean = this.options.get('autoFirst')!.getValue();
            let redoOpt: boolean = this.options.get('redo')!.getValue();
            let matchMethod: MatchMethod = this.options.get('matchMethod')!.getValue();

            console.log('[Custom Autocomplete] Do custom newList()');
            // destroy old instance
            if (acc.awesomepleteInstance) {
                acc.awesomepleteInstance.destroy();
            }
            // create new instance
            if (matchMethod === 'Origin') {
                acc.awesomepleteInstance = new AmqAwesomeplete(acc.$input[0],
                    {
                        list: acc.list,
                        minChars: 1,
                        maxItems: 25
                    },
                    true);
            } else if (matchMethod === 'FZF') {
                acc.awesomepleteInstance = new this._FZFAwesomeplete(acc.$input[0],
                    {
                        list: acc.list,
                        minChars: 1,
                        maxItems: 25
                    },
                    true);
            }
            // setup replace method
            if (redoOpt) {
                acc.awesomepleteInstance.replace = function (suggestion: any) {
                    (this as any).input.focus();
                    (this as any).input.select();
                    document.execCommand('insertText', false, suggestion.value);
                }
            }
            // setup autoFirst
            quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance.autoFirst = autoFirst;
        };

        // option callback
        this.options.get('autoFirst')!.input.on('click', () => {
            let opt = this.options.get('autoFirst')!.getValue();
            if (quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance) {
                quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance.autoFirst = opt;
            }
        });
        this.options.get('redo')!.input.on('click', () => {this.updateAutoComplete()});
        this.options.get('matchMethod')!.input.on('change', () => {this.updateAutoComplete()});
    }
    enable(): void {
        this._enabled = true;
        quiz.answerInput.typingInput.autoCompleteController.newList = this._customNewList;
        this.updateAutoComplete();
    }
    disable(): void {
        this._enabled = false;
        quiz.answerInput.typingInput.autoCompleteController.newList = this._originNewList;
        this.updateAutoComplete();
    }
    enabled(): boolean {
        return this._enabled;
    }
    private updateAutoComplete() {
        quiz.answerInput.typingInput.autoCompleteController.newList();
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new CustomAutocomplete());
    });
}

$(main);