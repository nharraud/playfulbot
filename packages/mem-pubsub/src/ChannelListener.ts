import { AsyncStream } from './AsyncStream';
// import { ChannelData, ChannelName } from './messages';
import { TransformAsyncIterator } from './TransformAsyncIterator';

export class ChannelListener<ChannelData, CHANNEL extends keyof ChannelData> extends AsyncStream<
  ChannelData[CHANNEL]
> {
  constructor(
    readonly channel: CHANNEL,
    readonly subChannel: string,
    readonly unsubscribe: (listener: ChannelListener<any, any>) => void
  ) {
    super();
  }

  return(): Promise<IteratorResult<ChannelData[CHANNEL]>> {
    this.unsubscribe(this);
    return super.return();
  }

  map<OUTPUT>(
    transform: (input: ChannelData[CHANNEL]) => OUTPUT
  ): AsyncIterator<OUTPUT, undefined> {
    return new TransformAsyncIterator(this, transform);
  }
}
