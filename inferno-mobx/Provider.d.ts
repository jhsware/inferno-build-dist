import { Component } from 'inferno';
export declare class Provider extends Component<any, any> {
    render(props: any): any;
    getChildContext(): {
        mobxStores: any;
    };
}
