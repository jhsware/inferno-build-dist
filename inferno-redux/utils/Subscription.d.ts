import { Store, Unsubscribe } from 'redux';
export declare type Listener = () => void;
export declare class Subscription {
    private store;
    private parentSub;
    private onStateChange;
    private unsubscribe;
    private listeners;
    constructor(store: Store<any>, parentSub: Subscription | null, onStateChange: () => void);
    addNestedSub(listener: any): Unsubscribe;
    notifyNestedSubs(): void;
    isSubscribed(): boolean;
    trySubscribe(): void;
    tryUnsubscribe(): void;
}
