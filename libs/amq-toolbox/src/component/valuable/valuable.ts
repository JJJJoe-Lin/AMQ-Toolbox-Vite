import { IComponent, ComponentOpt } from '../component';

export interface ValuableOpt<T> extends ComponentOpt {
    defaultValue?: T;
}

export interface IValuable<T> extends IComponent {
    getValue(): T;
    setValue(val: T): void;
};