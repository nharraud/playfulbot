export interface Versionned<VERSION> {
  version: VERSION;
}

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
    private readonly getInitialVersion: () => Promise<TINITIAL>
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<TNEXT | TINITIAL, TRETURN> {
    return this;
  }

  async next(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    if (this.initialVersion === undefined) {
      const init = await this.getInitialVersion();
      this.initialVersion = init.version;
      return { done: false, value: init };
    }
    let next = await this.inputIterator.next();
    if (next.done) {
      return next;
    }
    while (!next.done && (next.value as TNEXT).version <= this.initialVersion) {
      next = await this.inputIterator.next();
    }
    return next;
  }

  async return(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    await this.inputIterator.return();
    return { done: true, value: undefined };
  }

  async throw(err?: unknown): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    const result = await this.inputIterator.throw(err);
    return { done: true, value: undefined };
  }
}
