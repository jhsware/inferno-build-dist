import { Dispatch } from 'redux';
export interface IConnectOptions {
    /**
     * the func used to compute this HOC's displayName from the wrapped component's displayName.
     * probably overridden by wrapper functions such as connect().
     *
     * @memberOf IConnectOptions
     */
    getDisplayName: (name: string) => string;
    /**
     * shown in error messages.
     * probably overridden by wrapper functions such as connect()
     *
     * @type {string}
     * @memberOf IConnectOptions
     */
    methodName: string;
    /**
     * if defined, the name of the property passed to the wrapped element indicating the number of
     * calls to render. useful for watching in react devtools for unnecessary re-renders.
     *
     * @type {(string | null)}
     * @memberOf IConnectOptions
     */
    renderCountProp: string | null;
    /**
     * determines whether this HOC subscribes to store changes.
     *
     * @type {boolean}
     * @memberOf IConnectOptions
     */
    shouldHandleStateChanges: boolean;
    /**
     * the key of props/context to get the store.
     *
     * @type {string}
     * @memberOf IConnectOptions
     */
    storeKey: string;
    /**
     * if true, the wrapped element is exposed by this HOC via the getWrappedInstance() function.
     *
     * @type {boolean}
     * @memberOf IConnectOptions
     */
    withRef: boolean;
    initMapStateToProps?: any;
    initMapDispatchToProps?: any;
    initMergeProps?: any;
    pure?: any;
    areStatesEqual?: any;
    areOwnPropsEqual?: any;
    areStatePropsEqual?: any;
    areMergedPropsEqual?: any;
}
export declare type SelectorFactory = (dispatch: Dispatch<any>, options: IConnectOptions) => (state: any, props: any) => any;
export declare function connectAdvanced(selectorFactory: SelectorFactory, { getDisplayName, methodName, renderCountProp, shouldHandleStateChanges, storeKey, withRef, ...connectOptions }: Partial<IConnectOptions>): <T extends Function>(WrappedComponent: T) => T;
