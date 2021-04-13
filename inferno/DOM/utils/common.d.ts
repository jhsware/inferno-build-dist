import type { InfernoNode, VNode } from './../../core/types';
export declare const EMPTY_OBJ: {};
export declare const Fragment: string;
export declare class AnimationQueues {
    componentDidAppear: Function[];
    componentWillDisappear: Function[];
    constructor();
}
export declare function normalizeEventName(name: any): any;
export declare function appendChild(parentDOM: any, dom: any): void;
export declare function insertOrAppend(parentDOM: Element, newNode: any, nextNode: any): void;
export declare function documentCreateElement(tag: any, isSVG: boolean): Element;
export declare function replaceChild(parentDOM: Element, newDom: any, lastDom: any): void;
export declare function removeChild(parentDOM: Element, childNode: Element): void;
export declare function callAll(arrayFn: Function[]): void;
export declare function findDOMfromVNode(vNode: VNode, startEdge: boolean): Element | null;
export declare function callAllAnimationHooks(animationQueue: Function[], callback?: Function): void;
export declare function clearVNodeDOM(vNode: VNode, parentDOM: Element, deferredRemoval: boolean): void;
export declare function removeVNodeDOM(vNode: VNode, parentDOM: Element, animations: AnimationQueues): void;
export declare function moveVNodeDOM(vNode: any, parentDOM: any, nextNode: any): void;
export declare function getComponentName(instance: any): string;
export declare function createDerivedState(instance: any, nextProps: any, state: any): any;
export declare const renderCheck: {
    v: boolean;
};
export declare const options: {
    componentComparator: ((lastVNode: VNode, nextVNode: VNode) => boolean) | null;
    createVNode: ((vNode: VNode) => void) | null;
    renderComplete: ((rootInput: VNode | InfernoNode, parentDOM: Element | SVGAElement | ShadowRoot | DocumentFragment | HTMLElement | Node) => void) | null;
    reactStyles?: boolean;
};
export declare function setTextContent(dom: Element, children: any): void;
export declare function isLastValueSameLinkEvent(lastValue: any, nextValue: any): boolean;
export declare function mergeUnsetProperties(to: any, from: any): any;
export declare function safeCall1(method: Function | null | undefined, arg1: any): boolean;
