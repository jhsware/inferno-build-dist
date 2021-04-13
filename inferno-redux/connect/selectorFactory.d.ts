export declare const impureFinalPropsSelectorFactory: (mapStateToProps: any, mapDispatchToProps: any, mergeProps: any, dispatch: any) => (state: any, ownProps: any) => any;
export declare const pureFinalPropsSelectorFactory: (mapStateToProps: any, mapDispatchToProps: any, mergeProps: any, dispatch: any, { areStatesEqual, areOwnPropsEqual, areStatePropsEqual }: {
    areStatesEqual: any;
    areOwnPropsEqual: any;
    areStatePropsEqual: any;
}) => (nextState: any, nextOwnProps: any) => any;
export declare const defaultSelectorFactory: (dispatch: any, { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...opts }: {
    [x: string]: any;
    initMapStateToProps: any;
    initMapDispatchToProps: any;
    initMergeProps: any;
}) => (nextState: any, nextOwnProps: any) => any;
