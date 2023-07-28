import { IButton } from '../button';
import { Container, ContainerOpt, IContainer } from './container';

export interface ButtonsOpt extends ContainerOpt {}

export interface IButtons extends IContainer<IButton> {}; 

export class Buttons extends Container<IButton> implements IButtons {
    constructor (opt: ButtonsOpt) {
        super(opt);
        this.self.addClass('amqtbButtonContainer');
    }
}