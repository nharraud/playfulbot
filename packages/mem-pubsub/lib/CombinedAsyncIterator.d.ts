type IteratorNext<Type> = Type extends AsyncIterator<infer TNEXT, any> ? TNEXT : never;
type IteratorReturn<Type> = Type extends AsyncIterator<any, infer TRETURN> ? TRETURN : never;
type CombineIterators<ITERS extends AsyncIterator<any>[]> = AsyncIterator<IteratorNext<ITERS[number]>, IteratorReturn<ITERS[number]>>;
type CombineResults<ITERS extends AsyncIterator<any>[]> = IteratorResult<IteratorNext<ITERS[number]>, IteratorReturn<ITERS[number]>>;
export declare class CombinedAsyncIterator<ITERS extends AsyncIterator<any>[]> implements CombineIterators<ITERS> {
    private readonly iterators;
    private readonly doneWhenFirstIteratorDone;
    private promises;
    private queue;
    private done;
    constructor(iterators: ITERS, doneWhenFirstIteratorDone?: boolean);
    [Symbol.asyncIterator](): CombineIterators<ITERS>;
    next(): Promise<CombineResults<ITERS>>;
    return(): Promise<CombineResults<ITERS>>;
    throw(err?: unknown): Promise<CombineResults<ITERS>>;
}
export {};
//# sourceMappingURL=CombinedAsyncIterator.d.ts.map