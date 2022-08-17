import { IPlugin, onStartPageLoaded, registerPlugin } from 'amq-toolbox';

declare var quiz: any;
declare var Listener: any; 

class NoAvatarSnipe implements IPlugin {
    public name = 'No Avatar Snipe';
    private _enabled = false;
    private oldListener: any;
    private listener: any;

    constructor () {
        this.oldListener = quiz._playerAnswerListener;
        this.listener = new Listener("play next song", function(){});
        this.enable();
    }
    
    enable(): void {
        if (!this._enabled) {
            this._enabled = true;
            quiz._playerAnswerListener.unbindListener();
            quiz._playerAnswerListener = this.listener;
            quiz._playerAnswerListener.bindListener();
        }
    }

    disable(): void {
        if (this._enabled) {
            this._enabled = false;
            quiz._playerAnswerListener.unbindListener();
            quiz._playerAnswerListener = this.oldListener;
            quiz._playerAnswerListener.bindListener();
        }
    }

    enabled(): boolean {
        return this._enabled;
    }
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new NoAvatarSnipe());
    });
}

$(main);