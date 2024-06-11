import { DeferredPromise } from './utils/DeferredPromise.js';
class ChainedPromise extends DeferredPromise {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export class AsyncStream {
    lastPromise;
    currentPromise;
    constructor() {
        this.lastPromise = new DeferredPromise();
        this.currentPromise = this.lastPromise.promise;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    push(value) {
        const chainedPromise = new ChainedPromise(value);
        this.lastPromise.resolve(chainedPromise);
        this.lastPromise = chainedPromise;
    }
    async next() {
        const result = await this.currentPromise;
        if (!result) {
            return { value: undefined, done: true };
        }
        this.currentPromise = result.promise;
        return { value: result.value, done: false };
    }
    return() {
        this.lastPromise.resolve(undefined);
        return Promise.resolve({ value: undefined, done: true });
    }
    throw(err) {
        this.complete();
        return Promise.reject(err);
    }
    complete() {
        this.lastPromise.resolve(undefined);
    }
}
//# sourceMappingURL=AsyncStream.js.map