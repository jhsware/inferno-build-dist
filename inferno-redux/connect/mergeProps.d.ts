export declare const defaultMergeProps: (stateProps: any, dispatchProps: any, ownProps: any) => object;
export declare const wrapMergePropsFunc: (mergeProps: any) => (_dispatch: any, { displayName, pure, areMergedPropsEqual }: {
    displayName: any;
    pure: any;
    areMergedPropsEqual: any;
}) => (stateProps: any, dispatchProps: any, ownProps: any) => any;
export declare const whenMergePropsIsFunction: (mergeProps: any) => ((_dispatch: any, { displayName, pure, areMergedPropsEqual }: {
    displayName: any;
    pure: any;
    areMergedPropsEqual: any;
}) => (stateProps: any, dispatchProps: any, ownProps: any) => any) | undefined;
export declare const whenMergePropsIsOmitted: (mergeProps: any) => (() => (stateProps: any, dispatchProps: any, ownProps: any) => object) | undefined;
export declare const defaultMergePropsFactories: ((mergeProps: any) => ((_dispatch: any, { displayName, pure, areMergedPropsEqual }: {
    displayName: any;
    pure: any;
    areMergedPropsEqual: any;
}) => (stateProps: any, dispatchProps: any, ownProps: any) => any) | undefined)[];
