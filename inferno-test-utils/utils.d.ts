import { Component, VNode } from 'inferno';
export declare function isVNode(obj: any): obj is VNode;
export declare function isTextVNode(obj: VNode): obj is VNode;
export declare function isFunctionalVNode(obj: VNode): obj is VNode;
export declare function isClassVNode(obj: VNode): obj is VNode;
export declare function isComponentVNode(obj: VNode): obj is VNode;
export declare function getTagNameOfVNode(vNode: VNode): string | undefined;
export declare function isDOMVNode(vNode: any): vNode is VNode;
export declare class Wrapper<P, S> extends Component<P, S> {
    render(): import("inferno").InfernoNode | undefined;
}
