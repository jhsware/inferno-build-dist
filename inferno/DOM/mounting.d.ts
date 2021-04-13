import type { VNode } from '../core/types';
import { AnimationQueues } from './utils/common';
export declare function mount(vNode: VNode, parentDOM: Element | null, context: Object, isSVG: boolean, nextNode: Element | null, lifecycle: Function[], animations: AnimationQueues): void;
export declare function mountText(vNode: VNode, parentDOM: Element | null, nextNode: Element | null): void;
export declare function mountElement(vNode: VNode, parentDOM: Element | null, context: Object, isSVG: boolean, nextNode: Element | null, lifecycle: Function[], animations: AnimationQueues): void;
export declare function mountArrayChildren(children: any, dom: Element | null, context: Object, isSVG: boolean, nextNode: Element | null, lifecycle: Function[], animations: AnimationQueues): void;
export declare function mountClassComponent(vNode: VNode, parentDOM: Element | null, context: Object, isSVG: boolean, nextNode: Element | null, lifecycle: Function[], animations: AnimationQueues): void;
export declare function mountFunctionalComponent(vNode: VNode, parentDOM: Element | null, context: Object, isSVG: boolean, nextNode: Element | null, lifecycle: any, animations: AnimationQueues): void;
export declare function mountClassComponentCallbacks(ref: any, instance: any, lifecycle: Function[], animations: AnimationQueues): void;
export declare function mountFunctionalComponentCallbacks(vNode: VNode, lifecycle: Function[], animations: AnimationQueues): void;
