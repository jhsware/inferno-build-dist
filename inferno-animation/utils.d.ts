declare global {
    var __INFERNO_ANIMATION_DEBUG__: Boolean;
}
export declare function addClassName(node: HTMLElement, className: string): void;
export declare function removeClassName(node: HTMLElement, className: string): void;
export declare function forceReflow(): number;
export declare function setDisplay(node: HTMLElement, value?: string): string;
export declare function getDimensions(node: HTMLElement): {
    height: number;
    width: number;
};
export declare function setDimensions(node: HTMLElement, width: number, height: number): void;
export declare function clearDimensions(node: HTMLElement): void;
/**
 * You need to pass the root element and ALL animated children that have transitions,
 * if there are any,  so the timeout is set to the longest duration. Otherwise there
 * will be animations that fail to complete before the timeout is triggered.
 *
 * @param nodes a list of nodes that have transitions that are part of this animation
 * @param callback callback when all transitions of participating nodes are completed
 */
export declare function registerTransitionListener(nodes: HTMLElement[], callback: Function): void;
