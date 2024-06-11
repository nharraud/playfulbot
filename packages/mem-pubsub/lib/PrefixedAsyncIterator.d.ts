export declare class PrefixedAsyncIterator<TNEXT, TINITIAL, TRETURN = any> implements AsyncIterator<TNEXT | TINITIAL, TRETURN> {
    private readonly inputIterator;
    private initial;
    constructor(inputIterator: AsyncIterator<TNEXT, TRETURN>, initial: () => Promise<TINITIAL>);
    [Symbol.asyncIterator](): AsyncIterator<TNEXT | TINITIAL, TRETURN>;
    next(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
    return(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
    throw(err?: unknown): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
}
//# sourceMappingURL=PrefixedAsyncIterator.d.ts.map