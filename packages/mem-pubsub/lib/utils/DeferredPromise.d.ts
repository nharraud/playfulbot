export declare class DeferredPromise<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
    constructor();
}
//# sourceMappingURL=DeferredPromise.d.ts.map