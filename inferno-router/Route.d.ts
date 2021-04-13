import { Component, IComponentConstructor, InfernoNode, SFC } from 'inferno';
import * as H from 'history';
export interface Match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
export interface RouteComponentProps<P> {
    match: Match<P>;
    location: H.Location;
    history: H.History;
    staticContext?: any;
}
export interface IRouteProps {
    computedMatch?: any;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
    component?: IComponentConstructor<any> | SFC<any>;
    render?: (props: RouteComponentProps<any>, context: any) => InfernoNode;
    location?: H.Location;
    children?: ((props: RouteComponentProps<any>) => InfernoNode) | InfernoNode;
}
/**
 * The public API for matching a single path and rendering.
 */
declare class Route extends Component<IRouteProps, any> {
    getChildContext(): {
        router: any;
    };
    constructor(props?: any, context?: any);
    computeMatch({ computedMatch, location, path, strict, exact, sensitive }: {
        computedMatch: any;
        location: any;
        path: any;
        strict: any;
        exact: any;
        sensitive: any;
    }, router: any): any;
    componentWillReceiveProps(nextProps: any, nextContext: any): void;
    render(): any;
}
export { Route };
