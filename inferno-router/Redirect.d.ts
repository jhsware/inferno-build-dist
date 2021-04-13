import { Component } from 'inferno';
export interface RedirectProps {
    from?: string;
    to: string;
    exact?: any;
    push?: boolean;
}
export declare class Redirect extends Component<RedirectProps, any> {
    isStatic(): any;
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    perform(): void;
    render(): null;
}
