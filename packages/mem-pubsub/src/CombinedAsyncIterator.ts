type IteratorNext<Type> = Type extends AsyncIterator<infer TNEXT, any> ? TNEXT : never;
type IteratorReturn<Type> = Type extends AsyncIterator<any, infer TRETURN> ? TRETURN : never;

type CombineIterators<ITERS extends AsyncIterator<any>[]> = AsyncIterator<
  IteratorNext<ITERS[number]>,
  IteratorReturn<ITERS[number]>
>;

type CombineResults<ITERS extends AsyncIterator<any>[]> = IteratorResult<
  IteratorNext<ITERS[number]>,
  IteratorReturn<ITERS[number]>
>;

export class CombinedAsyncIterator<ITERS extends AsyncIterator<any>[]>
  implements CombineIterators<ITERS>
{
  private promises: Promise<CombineResults<ITERS>>[] = undefined;
  private queue = new Array<CombineResults<ITERS>>();
  private done = false;

  constructor(
    private readonly iterators: ITERS,
    private readonly doneWhenFirstIteratorDone: boolean = false
  ) {
    this.iterators = iterators;
  }

  [Symbol.asyncIterator](): CombineIterators<ITERS> {
    return this;
  }

  async next(): Promise<CombineResults<ITERS>> {
    if (this.promises === undefined) {
      this.promises = this.iterators.map((iterator, index) => {
        const update = async (result: CombineResults<ITERS>) => {
          if (result.done) {
            if (this.doneWhenFirstIteratorDone) {
              this.done = true;
              await Promise.all(
                this.iterators.filter((iter) => iter !== iterator).map((iter) => iter.return())
              );
              for (let idx = 0; idx < this.promises.length; idx += 1) {
                this.promises[idx] = undefined;
              }
            } else {
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

  async return(): Promise<CombineResults<ITERS>> {
    await Promise.all(this.iterators.map((iterator) => iterator.return()));
    return { done: true, value: undefined };
  }

  async throw(err?: unknown): Promise<CombineResults<ITERS>> {
    await Promise.all(this.iterators.map(async (iterator) => {
      try { await iterator.throw(err) } catch(err) {}
    }));
    return Promise.reject(err);
  }
}
