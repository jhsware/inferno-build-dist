import { Component, InfernoNode } from 'inferno';
import type { History } from 'history';
export interface IRouterProps {
    history: History<any>;
    children: InfernoNode;
}
/**
 * The public API for putting history on context.
 */
export declare class Router extends Component<IRouterProps, any> {
    unlisten: any;
    constructor(props: IRouterProps, context?: any);
    getChildContext(): {
        router: any;
    };
    computeMatch(pathname: any): {
        isExact: boolean;
        params: {};
        path: string;
        url: string;
    };
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(props: IRouterProps): InfernoNode;
}
