import { AMQ_Toolbox, Plugin } from 'amq-toolbox';

declare var amqToolbox: AMQ_Toolbox;
declare var quiz: any;
declare var Listener: any; 

class NoAvatarSnipe implements Plugin {
    name = 'No Avatar Snipe';
    private _enabled = false;
    private oldListener: any;
    private listener: any;

    constructor () {
        this.oldListener = quiz._playerAnswerListener;
        this.listener = new Listener("play next song", function(){});
    }
    
    get enabled() {
        return this._enabled;
    }
    
    set enabled(val: boolean) {
        if (val !== this._enabled) {
            this._enabled = val;
            if (val) {
                quiz._playerAnswerListener.unbindListener();
                quiz._playerAnswerListener = this.listener;
                quiz._playerAnswerListener.bindListener();
            } else {
                quiz._playerAnswerListener.unbindListener();
                quiz._playerAnswerListener = this.oldListener;
                quiz._playerAnswerListener.bindListener();
            }
        }
    }
}

function setup() {
    if ((unsafeWindow as any).amqToolbox === undefined) {
        (unsafeWindow as any).amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new NoAvatarSnipe();
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