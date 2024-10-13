export interface Versionned<VERSION> {
  version: VERSION;
}

/**
 * AsyncIterator of versioned items, i.e. objects with property "version". It is given another
 * AsyncIterator and an initial versioned item. it will first return the initial item, then it will
 * return items of the provided iterator which have a version > to the version of the initial item.
 */
export class VersionedAsyncIterator<
  VERSION,
  TNEXT extends Versionned<VERSION>,
  TINITIAL extends Versionned<VERSION>,
  TRETURN = any
> implements AsyncIterator<TNEXT | TINITIAL, TRETURN>
{
  private initialVersion?: VERSION = undefined;

  constructor(
    private readonly inputIterator: AsyncIterator<TNEXT, TRETURN>,
    private readonly getInitialVersion: () => Promise<TINITIAL | null | undefined>
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<TNEXT | TINITIAL, TRETURN> {
    return this;
  }

  async next(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    if (this.initialVersion === undefined) {
      const init = await this.getInitialVersion();
      if (init) {
        this.initialVersion = init.version;
        return { done: false, value: init };
      }
      this.initialVersion = null;
    }
    let next = await this.inputIterator.next();
    if (next.done) {
      return next;
    }
    while (!next.done && this.initialVersion !== null && (next.value as TNEXT).version <= this.initialVersion) {
      next = await this.inputIterator.next();
    }
    return next;
  }

  async return(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    await this.inputIterator.return();
    return { done: true, value: undefined };
  }

  async throw(err?: unknown): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    return this.inputIterator.throw(err);
  }
}
