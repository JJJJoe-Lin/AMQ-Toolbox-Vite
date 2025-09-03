import {
    CheckboxOption,
    IPlugin,
    Options,
    RadioOption,
    onStartPageLoaded,
    registerPlugin
} from 'amq-toolbox';

declare var quiz: any;
declare var Listener: any; 
declare var fitTextToContainer: Function;

async function fetchJPJsonData() {
    const jsonUrl = 'https://files.catbox.moe/o0l7q4.json';
    try {
        let response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        let jsonData = await response.json();
        return jsonData
    } catch (error) {
        console.error('Failed to fetch JSON data:', error);
    }
}

class JapaneseTitle implements IPlugin {
    public name = 'Japanese title';
    public options;
    private _enabled = false;
    private hintListener: any;
    private answerResultListener: any;
    private titleToJA: any;
    private animeData: any;
    private currentSongInfo: any;
    
    constructor() {
        // create options
        this.options = new Options({
            title: this.name,
        });
        this.options.push(new CheckboxOption({
            name: 'japaneseAnswer',
            inputId: 'amqtbJapaneseTitleJapaneseAnswer',
            label: 'Include answer in Japanese in result stage',
            offset: 0,
            saveIn: 'Script',
            defaultValue: true,
        }));
        this.options.push(new CheckboxOption({
            name: 'japaneseMC',
            inputId: 'amqtbJapaneseTitleJapaneseMC',
            label: 'Mutliple choice in Japanese',
            offset: 0,
            saveIn: 'Script',
            defaultValue: true,
        }));
        fetchJPJsonData().then(jsonData => {
            this.titleToJA = jsonData.reduce((acc: any, cur: any) => {
                if (!cur.JA) {
                    return acc;
                }
                /*if (!this.containsCJK(cur.JA)) {
                    return acc;
                }*/
                if (!(cur.EN in acc)) {
                    acc[cur.EN] = cur.JA;
                }
                if (!(cur.RO in acc)) {
                    acc[cur.RO] = cur.JA;
                }
                return acc;
            }, {})
            this.animeData = jsonData.reduce((acc: any, cur: any) => {
                if (!cur || !cur.annId) {
                    return acc;
                }
                acc[Number(cur.annId)] = cur;
                return acc
            }, {})
        })
        
        this.hintListener = new Listener("quiz hint used", this.translateMC.bind(this));
        this.answerResultListener = new Listener("answer results", this.translateAnswer.bind(this));

    }
    enable(): void {
        if (this._enabled) {
            return
        }
        this._enabled = true;
        this.hintListener.bindListener();
        this.answerResultListener.bindListener();
    }
    disable(): void {
        if (!this._enabled) {
            return
        }
        this._enabled = false;
        this.hintListener.unbindListener();
        this.answerResultListener.unbindListener();
    }
    enabled(): boolean {
        return this._enabled;
    }
    private translateAnswer(result: any) {
        if (!(this.options.get('japaneseAnswer') as CheckboxOption).getValue()) {
            return;
        }
        this.currentSongInfo = result.songInfo
        setTimeout(this._translateAnswer.bind(this), 500);
    }
    private _translateAnswer() {
        if (this.animeData == null) {
            return;
        }
        let titleNode = document.getElementById('qpAnimeName');
        if (!titleNode) {
            console.log("Title element is not found");
            return;
        }
        let annId = Number(this.currentSongInfo.annId)
        let jpTitle = this.animeData[annId]['JA']
        if (jpTitle) {
            titleNode.innerHTML += "<br>" + jpTitle;
            console.log("jpTitle appended")
        }
        quiz.infoContainer.fitTextToContainer()

    }
    private translateMC(hintId: any, songValue: any) {
        if (!(this.options.get('japaneseMC') as CheckboxOption).getValue()) {
            return;
        }
        if (this.titleToJA == null) {
            return
        }

        let choices = quiz.answerInput.multipleChoice.answerOptions
        for (let i = 0; i < choices.length; i++) {
            let text = choices[i].currentName;
            if (text == null) {
                continue;
            }
            if (text in this.titleToJA) {
                choices[i].$text.text(this.titleToJA[text]);
            }
            fitTextToContainer(choices[i].$text, choices[i].$textContainer, 18, 8)
        }
    }
    private containsCJK(text: string) {
        // Common CJK Unified Ideographs range
        return /[\u4E00-\u9FFF]/.test(text); 
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new JapaneseTitle());
    });
}

$(main);
