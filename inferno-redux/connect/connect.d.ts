import { connectAdvanced } from '../components/connectAdvanced';
export declare const createConnect: ({ connectHOC, mapStateToPropsFactories, mapDispatchToPropsFactories, mergePropsFactories, selectorFactory }?: {
    connectHOC?: typeof connectAdvanced | undefined;
    mapStateToPropsFactories?: ((mapStateToProps: any) => ((_dispatch: any, { displayName }: {
        displayName: any;
    }) => any) | undefined)[] | undefined;
    mapDispatchToPropsFactories?: ((mapDispatchToProps: any) => ((_dispatch: any, { displayName }: {
        displayName: any;
    }) => any) | undefined)[] | undefined;
    mergePropsFactories?: ((mergeProps: any) => ((_dispatch: any, { displayName, pure, areMergedPropsEqual }: {
        displayName: any;
        pure: any;
        areMergedPropsEqual: any;
    }) => (stateProps: any, dispatchProps: any, ownProps: any) => any) | undefined)[] | undefined;
    selectorFactory?: ((dispatch: any, { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...opts }: {
        [x: string]: any;
        initMapStateToProps: any;
        initMapDispatchToProps: any;
        initMergeProps: any;
    }) => (nextState: any, nextOwnProps: any) => any) | undefined;
}) => (mapStateToProps?: any, mapDispatchToProps?: any, mergeProps?: any, { pure, areStatesEqual, areOwnPropsEqual, areStatePropsEqual, areMergedPropsEqual, ...extraOptions }?: {
    pure?: boolean | undefined;
    areStatesEqual?: ((a: any, b: any) => boolean) | undefined;
    areOwnPropsEqual?: ((a: any, b: any) => boolean) | undefined;
    areStatePropsEqual?: ((a: any, b: any) => boolean) | undefined;
    areMergedPropsEqual?: ((a: any, b: any) => boolean) | undefined;
}) => <T extends Function>(WrappedComponent: T) => T;
export declare const connect: (mapStateToProps?: any, mapDispatchToProps?: any, mergeProps?: any, { pure, areStatesEqual, areOwnPropsEqual, areStatePropsEqual, areMergedPropsEqual, ...extraOptions }?: {
    pure?: boolean | undefined;
    areStatesEqual?: ((a: any, b: any) => boolean) | undefined;
    areOwnPropsEqual?: ((a: any, b: any) => boolean) | undefined;
    areStatePropsEqual?: ((a: any, b: any) => boolean) | undefined;
    areMergedPropsEqual?: ((a: any, b: any) => boolean) | undefined;
}) => <T extends Function>(WrappedComponent: T) => T;
