export class CombinedAsyncIterator {
    iterators;
    doneWhenFirstIteratorDone;
    promises = undefined;
    queue = new Array();
    done = false;
    constructor(iterators, doneWhenFirstIteratorDone = false) {
        this.iterators = iterators;
        this.doneWhenFirstIteratorDone = doneWhenFirstIteratorDone;
        this.iterators = iterators;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        if (this.promises === undefined) {
            this.promises = this.iterators.map((iterator, index) => {
                const update = async (result) => {
                    if (result.done) {
                        if (this.doneWhenFirstIteratorDone) {
                            this.done = true;
                            await Promise.all(this.iterators.filter((iter) => iter !== iterator).map((iter) => iter.return()));
                            for (let idx = 0; idx < this.promises.length; idx += 1) {
                                this.promises[idx] = undefined;
                            }
                        }
                        else {
                            this.promises[index] = undefined;
                        }
                        return undefined;
                    }
                    if (!this.done) {
                        this.queue.push(result);
                        this.promises[index] = iterator.next().then(update);
                        return result;
                    }
                    return undefined;
                };
                return iterator.next().then(update);
            });
        }
        let promises = this.promises.filter((prom) => prom !== undefined);
        while (this.queue.length === 0 && promises.length !== 0) {
            await Promise.race(promises);
            promises = this.promises.filter((prom) => prom !== undefined);
        }
        if (this.queue.length === 0 && promises.length === 0) {
            return { value: undefined, done: true };
        }
        const [next] = this.queue.splice(0, 1);
        return next;
    }
    async return() {
        await Promise.all(this.iterators.map((iterator) => iterator.return()));
        return { done: true, value: undefined };
    }
    async throw(err) {
        await Promise.all(this.iterators.map(async (iterator) => {
            try {
                await iterator.throw(err);
            }
            catch (err) { }
        }));
        return Promise.reject(err);
    }
}
//# sourceMappingURL=CombinedAsyncIterator.js.map