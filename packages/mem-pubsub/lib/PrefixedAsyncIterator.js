export class PrefixedAsyncIterator {
    inputIterator;
    initial;
    constructor(inputIterator, initial) {
        this.inputIterator = inputIterator;
        this.initial = initial;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        if (this.initial !== undefined) {
            const value = await this.initial();
            this.initial = undefined;
            return { done: false, value };
        }
        return this.inputIterator.next();
    }
    async return() {
        await this.inputIterator.return();
        return { done: true, value: undefined };
    }
    async throw(err) {
        const result = await this.inputIterator.throw(err);
        return { done: true, value: undefined };
    }
}
//# sourceMappingURL=PrefixedAsyncIterator.js.map