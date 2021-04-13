import { Component, Props, VNode } from 'inferno';
export interface IStaticRouterProps<P, T> extends Props<P, T> {
    basename?: string;
    context: any;
    location: any;
}
export declare class StaticRouter<P, S> extends Component<IStaticRouterProps<P, any>, S> {
    static defaultProps: {
        basename: string;
        location: string;
    };
    getChildContext(): {
        router: {
            staticContext: any;
        };
    };
    createHref: (path: any) => any;
    handlePush: (location: any) => void;
    handleReplace: (location: any) => void;
    handleListen: () => () => void;
    handleBlock: () => () => void;
    render({ basename, context, location, ...props }: {
        [x: string]: any;
        basename: any;
        context: any;
        location: any;
    }): VNode;
}
