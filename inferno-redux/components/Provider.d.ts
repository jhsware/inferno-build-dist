import { Component, InfernoNode } from 'inferno';
import { Action, AnyAction, Store } from 'redux';
export interface Props<A extends Action = AnyAction> {
    store: Store<any, A>;
    children?: InfernoNode;
}
export declare class Provider<A extends Action = AnyAction> extends Component<Props<A>, null> {
    static displayName: string;
    private readonly store;
    constructor(props: Props<A>, context: any);
    getChildContext(): {
        store: Store<any, A>;
        storeSubscription: null;
    };
    render(): InfernoNode | undefined;
    componentWillReceiveProps?(nextProps: Props<A>, nextContext: any): void;
}
