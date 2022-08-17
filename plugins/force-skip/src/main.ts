import { 
    Button,
    Buttons,
    IPlugin,
    onStartPageLoaded,
    registerPlugin,
} from 'amq-toolbox';

declare var quiz: any;
declare var Listener: any;
declare var quizVideoController: any;

const readyMsg = 'Start AutoSkip';
const readyStyle = 'success'
const runningMsg = 'Stop AutoSkip';
const runningStyle = 'danger';
const onceMsg = 'Skip'
const onceStyle = 'info';

class ForceSkip implements IPlugin {
    readonly name = 'Force Skip';
    readonly view;
    private _enabled = false;
    private isAutoSkipRunning: boolean = false;
    private readonly autoBtn;
    private readonly onceBtn;
    private playNextSongListener: any;
    private playNextSongDelayListener: any;
    private resultListener: any;
    
    constructor () {
        this.autoBtn = new Button({
            size: 'extra-small',
            style: this.isAutoSkipRunning ? runningStyle : readyStyle,
            label: this.isAutoSkipRunning ? runningMsg : readyMsg,
        });
        this.onceBtn = new Button({
            size: 'extra-small',
            style: onceStyle,
            label: onceMsg,
        });
        this.autoBtn.self.on('click',  () => {
            this.isAutoSkipRunning = !this.isAutoSkipRunning;
            if (this.isAutoSkipRunning) {
                this.autoBtn.style = runningStyle;
                this.autoBtn.label = runningMsg;
            } else {
                this.autoBtn.style = readyStyle;
                this.autoBtn.label = readyMsg;
            }
        });
        this.onceBtn.self.on('click', function () {
            console.log('Force skip on this song...');
            quiz.videoReady($(this).data("songID"));
        });
    
        this.view = new Buttons({});
        this.view.push(this.autoBtn, this.onceBtn);
        
        this.playNextSongListener = new Listener('play next song', this.playNextSongHandler.bind(this));
        this.playNextSongDelayListener = new Listener('play next song', this.playNextSongDelayHandler.bind(this));
        this.resultListener = new Listener('answer results', this.resultHandler.bind(this));

        this.enable();
    }

    enable(): void {
        if (!this._enabled) {
            this._enabled = true;
            this.playNextSongListener.bindListener();
            this.playNextSongDelayListener.bindListener();
            this.resultListener.bindListener();
        }
    }

    disable(): void {
        if (this._enabled) {
            this._enabled = false;
            this.playNextSongListener.unbindListener();
            this.playNextSongDelayListener.unbindListener();
            this.resultListener.unbindListener();
        }
    }

    enabled(): boolean {
        return this._enabled;
    }

    private playNextSongHandler() {
        this.onceBtn.self.addClass('disabled');
    }
    
    private playNextSongDelayHandler() {
        setTimeout(() => {
            if (quizVideoController._nextVideoInfo === null) {
                this.onceBtn.self.data('songID', null);
            } else {
                this.onceBtn.self.data('songID', quizVideoController._nextVideoInfo.songInfo.id);
            }
        }, 500);
    }
    
    private resultHandler() {
        if (this.onceBtn.self.data('songID') !== null) {
            this.onceBtn.self.removeClass('disabled');
            if (this.isAutoSkipRunning) {
                this.onceBtn.self.trigger("click");
            }
        }
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new ForceSkip());
    });
}

$(main);
