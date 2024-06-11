/**
 * Async iterator which proxies another async iterator. It calls a transform function on each item of the
 * provided iterator before returning it.
 */
export declare class TransformAsyncIterator<TNEXTORIGIN, TNEXTTRANSFORMED, TRESULT> implements AsyncIterator<TNEXTTRANSFORMED, TRESULT> {
    private readonly inputIterator;
    private readonly transform;
    constructor(inputIterator: AsyncIterator<TNEXTORIGIN, TRESULT>, transform: (input: TNEXTORIGIN) => TNEXTTRANSFORMED);
    [Symbol.asyncIterator](): AsyncIterator<TNEXTTRANSFORMED, TRESULT>;
    next(): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>>;
    return(): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>>;
    throw(err?: unknown): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>>;
}
//# sourceMappingURL=TransformAsyncIterator.d.ts.map