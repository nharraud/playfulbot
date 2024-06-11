/**
 * Async iterator which proxies another async iterator. It calls a transform function on each item of the
 * provided iterator before returning it.
 */
export class TransformAsyncIterator {
    inputIterator;
    transform;
    constructor(inputIterator, transform) {
        this.inputIterator = inputIterator;
        this.transform = transform;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        const result = await this.inputIterator.next();
        if (result.done) {
            return result;
        }
        return { done: false, value: this.transform(result.value) };
    }
    async return() {
        await this.inputIterator.return();
        return { done: true, value: undefined };
    }
    async throw(err) {
        // FIXME: we might need to transform the value in some cases
        return this.inputIterator.throw(err);
    }
}
//# sourceMappingURL=TransformAsyncIterator.js.map