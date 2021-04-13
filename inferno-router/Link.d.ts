import { VNode } from 'inferno';
import type { Location } from 'history';
export interface ILinkProps {
    children?: any;
    onClick?: any;
    target?: string;
    className?: string;
    replace?: boolean;
    to?: string | Location;
    innerRef?: any;
}
/**
 * The public API for rendering a history-aware <a>.
 */
export declare function Link(props: ILinkProps & LinkHTMLAttributes<HTMLLinkElement>, context: any): VNode;
