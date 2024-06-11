export interface Versionned<VERSION> {
    version: VERSION;
}
/**
 * AsyncIterator of versioned items, i.e. objects with property "version". It is given another
 * AsyncIterator and an initial versioned item. it will first return the initial item, then it will
 * return items of the provided iterator which have a version > to the version of the initial item.
 */
export declare class VersionedAsyncIterator<VERSION, TNEXT extends Versionned<VERSION>, TINITIAL extends Versionned<VERSION>, TRETURN = any> implements AsyncIterator<TNEXT | TINITIAL, TRETURN> {
    private readonly inputIterator;
    private readonly getInitialVersion;
    private initialVersion?;
    constructor(inputIterator: AsyncIterator<TNEXT, TRETURN>, getInitialVersion: () => Promise<TINITIAL>);
    [Symbol.asyncIterator](): AsyncIterator<TNEXT | TINITIAL, TRETURN>;
    next(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
    return(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
    throw(err?: unknown): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>>;
}
//# sourceMappingURL=VersionedAsyncIterator.d.ts.map