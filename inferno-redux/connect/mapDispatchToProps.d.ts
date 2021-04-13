export declare const whenMapDispatchToPropsIsFunction: (mapDispatchToProps: any) => ((_dispatch: any, { displayName }: {
    displayName: any;
}) => any) | undefined;
export declare const whenMapDispatchToPropsIsMissing: (mapDispatchToProps: any) => ((dispatch: any, options: any) => () => any) | undefined;
export declare const whenMapDispatchToPropsIsObject: (mapDispatchToProps: any) => ((dispatch: any, options: any) => () => any) | undefined;
export declare const defaultMapDispatchToPropsFactories: ((mapDispatchToProps: any) => ((_dispatch: any, { displayName }: {
    displayName: any;
}) => any) | undefined)[];
