import { DeferredPromise } from './utils/DeferredPromise.js';
declare class ChainedPromise<T> extends DeferredPromise<ChainedPromise<T>> {
    value: T;
    constructor(value: T);
}
export declare class AsyncStream<T> implements AsyncIterator<T, undefined> {
    lastPromise: DeferredPromise<ChainedPromise<T>>;
    currentPromise: Promise<ChainedPromise<T>>;
    constructor();
    [Symbol.asyncIterator](): AsyncIterator<T, undefined>;
    push(value: T): void;
    next(): Promise<IteratorResult<T, undefined>>;
    return(): Promise<IteratorResult<T, undefined>>;
    throw(err?: unknown): Promise<IteratorResult<T, undefined>>;
    complete(): void;
}
export {};
//# sourceMappingURL=AsyncStream.d.ts.map