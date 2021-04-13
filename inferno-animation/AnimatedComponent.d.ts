import { Component, InfernoNode } from 'inferno';
import { AnimationClass } from './animations';
declare type AnimationProp = {
    animation?: string | AnimationClass;
    children?: InfernoNode;
};
export declare class AnimatedComponent<P = {}, S = {}> extends Component<AnimationProp & P, S> {
    componentDidAppear(dom: HTMLElement): void;
    componentWillDisappear(dom: HTMLElement, callback: Function): void;
}
export {};
