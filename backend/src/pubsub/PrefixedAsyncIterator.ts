export class PrefixedAsyncIterator<TNEXT, TINITIAL, TRETURN = any>
  implements AsyncIterator<TNEXT | TINITIAL, TRETURN> {
  constructor(
    private readonly inputIterator: AsyncIterator<TNEXT, TRETURN>,
    private initial: () => Promise<TINITIAL>
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<TNEXT | TINITIAL, TRETURN> {
    return this;
  }

  async next(): Promise<IteratorResult<TNEXT | TINITIAL, TRETURN>> {
    if (this.initial !== undefined) {
      const value = await this.initial();
      this.initial = undefined;
      return { done: false, value };
    }
    return this.inputIterator.next();
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
