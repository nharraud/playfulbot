export class TransformAsyncIterator<TNEXTORIGIN, TNEXTTRANSFORMED, TRESULT>
  implements AsyncIterator<TNEXTTRANSFORMED, TRESULT> {
  constructor(
    private readonly inputIterator: AsyncIterator<TNEXTORIGIN, TRESULT>,
    private readonly transform: (input: TNEXTORIGIN) => TNEXTTRANSFORMED
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<TNEXTTRANSFORMED, TRESULT> {
    return this;
  }

  async next(): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>> {
    const result = await this.inputIterator.next();
    if (result.done) {
      return result;
    }
    return { done: false, value: this.transform(result.value as TNEXTORIGIN) };
  }

  async return(): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>> {
    await this.inputIterator.return();
    return { done: true, value: undefined };
  }

  async throw(err?: unknown): Promise<IteratorResult<TNEXTTRANSFORMED, TRESULT>> {
    const result = await this.inputIterator.throw(err);
    return { done: true, value: undefined };
  }
}
