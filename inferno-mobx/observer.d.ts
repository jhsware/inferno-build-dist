import { EventEmitter } from './utils/EventEmitter';
export declare const renderReporter: EventEmitter;
export declare function trackComponents(): void;
export declare function useStaticRendering(useStatic: boolean): void;
/**
 * Errors reporter
 */
export declare const errorsReporter: EventEmitter;
/**
 * Observer function / decorator
 */
export declare function observer(stores: string[]): <T>(clazz: T) => void;
export declare function observer<T>(stores: string[], clazz: T): T;
export declare function observer<T>(target: T): T;
export declare const Observer: ({ children }: {
    children: any;
}) => any;
/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */
export declare function inject(...storeNames: string[]): <T>(target: T) => T;
export declare function inject(fn: Function): <T>(target: T) => T;
