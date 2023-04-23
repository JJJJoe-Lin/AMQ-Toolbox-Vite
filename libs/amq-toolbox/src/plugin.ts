import { unsafeWindow } from '$';
import { IComponent, IOptions, ITab } from './component/main';
import { Toolbox } from './toolbox/toolbox';
import { onStartPageLoaded } from './utils/amq';

export interface IPlugin {
    name: string;
    dependencies?: string[];
    view?: IComponent;
    options?: IOptions;
    settingTab?: ITab;
    enable(): void;
    disable(): void;
    enabled(): boolean;
}

export function registerPlugin(plugin: IPlugin) {
    try {
        onStartPageLoaded(() => {
            if ((unsafeWindow as any).amqToolbox === undefined) {
                (unsafeWindow as any).amqToolbox = new Toolbox();
            }
            ((unsafeWindow as any).amqToolbox as Toolbox).addPlugin(plugin);
        });
    } catch (err) {
        console.error(`[registerPlugin] Failed to register ${plugin.name}`, err);
    }
}