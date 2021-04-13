export declare class EventEmitter {
    listeners: Function[];
    on(cb: Function): () => void;
    emit(data: any): void;
}
