/**
 * AsyncIterator of versioned items, i.e. objects with property "version". It is given another
 * AsyncIterator and an initial versioned item. it will first return the initial item, then it will
 * return items of the provided iterator which have a version > to the version of the initial item.
 */
export class VersionedAsyncIterator {
    inputIterator;
    getInitialVersion;
    initialVersion = undefined;
    constructor(inputIterator, getInitialVersion) {
        this.inputIterator = inputIterator;
        this.getInitialVersion = getInitialVersion;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        if (this.initialVersion === undefined) {
            const init = await this.getInitialVersion();
            this.initialVersion = init.version;
            return { done: false, value: init };
        }
        let next = await this.inputIterator.next();
        if (next.done) {
            return next;
        }
        while (!next.done && next.value.version <= this.initialVersion) {
            next = await this.inputIterator.next();
        }
        return next;
    }
    async return() {
        await this.inputIterator.return();
        return { done: true, value: undefined };
    }
    async throw(err) {
        return this.inputIterator.throw(err);
    }
}
//# sourceMappingURL=VersionedAsyncIterator.js.map