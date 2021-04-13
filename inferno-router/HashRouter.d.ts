import { Component, VNode } from 'inferno';
export interface IHashRouterProps {
    basename?: string;
    getUserConfirmation?: () => {};
    hashType?: string;
    children: Component<any, any>[] | JSX.Element;
}
export declare class HashRouter extends Component<IHashRouterProps, any> {
    history: any;
    constructor(props?: any, context?: any);
    render(): VNode;
}
