import { IOptionComponent } from '../valuable/option/option';
import { RadioOption } from '../valuable/option/radioOption';
import { Container, ContainerOpt, IContainer } from './container';

type AnyOption = IOptionComponent<any>;

export interface OptionsOpt extends ContainerOpt {
    title: string;
}

export interface IOptions extends IContainer<AnyOption> {
    refresh(): void;
};

export class Options extends Container<AnyOption> implements IOptions {
    private options = this.container;
    
    constructor (opt: OptionsOpt) {
        super(opt);
        this.self.addClass('col-xs-6');
        this.self.append($(`<h4>${opt.title}</h4>`)
            .css('text-align', 'center')
        );
    }

    refresh(): void {
        for (let option of this.options) {
            option.input.trigger('amqtoolbox.option.enables', String(option.getValue()));
        }
    }

    splice(start: number, deleteCount?: number | undefined): AnyOption[];
    splice(start: number, deleteCount: number, ...opts: AnyOption[]): AnyOption[];
    splice(start: number, deleteCount?: number, ...opts: AnyOption[]): AnyOption[] {
        let ret: AnyOption[];
        if (deleteCount === undefined) {
            ret = super.splice(start);
        } else {
            ret = super.splice(start, deleteCount, ...opts);
        }
        // check enables
        if (!checkEnables(this.options)) {
            throw new Error('Duplicated optionName in enables with other options');
        }
        return ret;
    }

    protected appendComponent(opt: AnyOption): void {
        this.self.append(opt.self);
        opt.input.on('amqtoolbox.option.enables', (_, optEnableKey) => {
            this.updateEnabled(opt, optEnableKey);
        });
    }

    protected detachComponent(opt: AnyOption): void {
        opt.self.detach();
        opt.input.off('amqtoolbox.option.enables');
    }

    private updateEnabled (opt: AnyOption, optEnableKey: string) {
        if (opt.enables) {
            const {enabledOptNames: enables, disabledOptNames: disables} = getEnables(opt, optEnableKey);
            for (let option of this.options) {
                if (enables.includes(option.name)) {
                    option.enable();
                } else if (disables.includes(option.name)) {
                    option.disable();
                }
            }
        }
        if (opt instanceof RadioOption) {
            opt.relayout();
        }
    }
}

function getEnables(opt: AnyOption): string[];
function getEnables(opt: AnyOption, optEnableKey: string)
: {enabledOptNames: string[], disabledOptNames: string[]};
function getEnables(opt: AnyOption, optEnableKey?: string) {
    const enabledOptNames: Set<string> = new Set();
    const disabledOptNames: Set<string> = new Set();
    if (opt.enables !== undefined) {
        for (let [key, optNames] of Object.entries(opt.enables)) {
            for (let optName of optNames) {
                if (optEnableKey === undefined || optEnableKey === key) {
                    enabledOptNames.add(optName);   
                } else {
                    disabledOptNames.add(optName);
                }
            }
        }
    }
    if (optEnableKey === undefined) {
        return [...enabledOptNames];
    } else {
        return {
            enabledOptNames: [...enabledOptNames],
            disabledOptNames: [...disabledOptNames],
        };
    }
}

function checkEnables (options: AnyOption[]): boolean {
    const optNames: Set<string> = new Set();
    for (let option of options) {
        const enables = getEnables(option);
        for (let enable of enables) {
            if (optNames.has(enable)) {
                return false;
            }
            optNames.add(enable);
        }
    }
    return true;
}