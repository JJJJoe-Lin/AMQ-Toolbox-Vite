import { Button } from '../button';
import { Container, ContainerOpt, IContainer } from './container';

export interface ButtonsOpt extends ContainerOpt<Button> {}

export interface IButtons extends IContainer<Button> {}; 

export class Buttons extends Container<Button> implements IButtons {
    constructor (opt: ButtonsOpt) {
        super(opt);
        this.self.addClass('amqtbButtonContainer');
    }
}