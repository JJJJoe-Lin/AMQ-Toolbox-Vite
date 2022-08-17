export interface ComponentOpt {
    name?: string;
    id?: string;
    class?: string;
}
export interface IComponent {
    readonly name?: string;
    readonly self: JQuery<HTMLElement>;
};