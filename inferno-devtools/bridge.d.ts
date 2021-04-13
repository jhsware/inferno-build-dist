export declare function createDevToolsBridge(): {
    ComponentTree: {
        getNodeFromInstance(devToolNode: any): any;
        getClosestInstanceFromNode(vNode: any): any;
    };
    Mount: any;
    Reconciler: any;
    _listener: (evt: any) => void;
};
