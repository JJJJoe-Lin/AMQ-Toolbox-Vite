import { 
    AMQ_Toolbox,
    AmqtbViewBlock,
    AmqtbButton,
    AmqtbButtonContainer,
    Plugin,
} from 'amq-toolbox';

declare var amqToolbox: AMQ_Toolbox;
declare var quiz: any;
declare var Listener: any;
declare var quizVideoController: any;

const readyMsg = 'Start AutoSkip';
const readyStyle = 'success'
const runningMsg = 'Stop AutoSkip';
const runningStyle = 'danger';
const onceMsg = 'Skip'
const onceStyle = 'info';

class ForceSkip implements Plugin {
    name = 'Force Skip';
    view: AmqtbViewBlock | undefined;
    private _enabled = false;
    private isAutoSkipRunning: boolean = false;
    private readonly autoBtn: AmqtbButton;
    private readonly onceBtn: AmqtbButton;
    private playNextSongListener: any;
    private playNextSongDelayListener: any;
    private resultListener: any;
    
    constructor () {
        this.autoBtn = new AmqtbButton({
            id: 'amqtbAutoSkip',
            name: 'autoBtn',
            size: 'extra-small',
            style: this.isAutoSkipRunning ? runningStyle : readyStyle,
            label: this.isAutoSkipRunning ? runningMsg : readyMsg,
        });
        this.onceBtn = new AmqtbButton({
            id: 'amqtbOnceSkip',
            name: 'onceBtn',
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
    
        const btnContainer = new AmqtbButtonContainer({});
        btnContainer.add(this.autoBtn, this.onceBtn);
        this.view = new AmqtbViewBlock({
            title: 'Force Skip',
            content: btnContainer.self,
        });
        
        this.playNextSongListener = new Listener('play next song', this.playNextSongHandler.bind(this));
        this.playNextSongDelayListener = new Listener('play next song', this.playNextSongDelayHandler.bind(this));
        this.resultListener = new Listener('answer results', this.resultHandler.bind(this));

        this.enabled = true;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val: boolean) {
        if (val !== this._enabled) {
            this._enabled = val;
            if (val) {
                this.playNextSongListener.bindListener();
                this.playNextSongDelayListener.bindListener();
                this.resultListener.bindListener();
            } else {
                this.playNextSongListener.unbindListener();
                this.playNextSongDelayListener.unbindListener();
                this.resultListener.unbindListener();
            }
        }
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

function setup() {
    if ((unsafeWindow as any).amqToolbox === undefined) {
        (unsafeWindow as any).amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new ForceSkip();
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
        }
    }, 500);
}

$(main);
