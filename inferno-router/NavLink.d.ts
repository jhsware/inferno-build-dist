import type { Location } from 'history';
interface NavLinkProps {
    to: string | Location;
    exact?: boolean;
    strict?: boolean;
    onClick?: any;
    location?: any;
    activeClassName?: string;
    className?: string;
    activeStyle?: any;
    style?: any;
    isActive?: (match: any, location: any) => boolean;
    ariaCurrent?: string;
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export declare function NavLink({ to, exact, strict, onClick, location: linkLocation, activeClassName, className, activeStyle, style, isActive: getIsActive, ariaCurrent, ...rest }: NavLinkProps): any;
export {};
