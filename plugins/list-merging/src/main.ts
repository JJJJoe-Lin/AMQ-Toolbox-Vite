import { AMQ_Toolbox, Plugin } from 'amq-toolbox';
import { redirectPathName, redirectURLHandler } from 'anime-list';
import { doTest } from './test';

declare var amqToolbox: AMQ_Toolbox;

class ListMerging implements Plugin {
    name = 'List Merging';
    private _enabled = false;

    constructor() { }

    get enabled() {
        return this._enabled;
    }

    set enabled(val: boolean) { }
}

function setup() {
    /* if ((unsafeWindow as any).amqToolbox === undefined) {
        (unsafeWindow as any).amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new ListMerging();
    const err = amqToolbox.registerPlugin(plugin);
    if (err) {
        console.error(err);
        plugin.enabled = false;
        return;
    } */
    doTest();
}

function main() {
    /* if (document.getElementById('startPage')) return;
    let loadInterval = setInterval(() => {
        if ($('#loadingScreen').hasClass('hidden')) {
            try {
                setup();
            } finally {
                clearInterval(loadInterval);
            }
        }
    }, 500); */
    setup();
}

// $(main);
const path = new URL(document.URL);
if (path.pathname === redirectPathName) {
    redirectURLHandler();
} else {
    $(main);
}