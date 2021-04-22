import { AsyncStream } from './AsyncStream';
import { ChannelData, ChannelName, VersionedMessage } from './messages';
import { TransformAsyncIterator } from './TransformedAsyncIterator';

export class ChannelListener<CHANNEL extends ChannelName> extends AsyncStream<
  ChannelData<CHANNEL>
> {
  constructor(
    readonly channel: CHANNEL,
    readonly subChannel: string,
    readonly unsubscribe: (listener: ChannelListener<any>) => void
  ) {
    super();
  }

  return(): Promise<IteratorResult<ChannelData<CHANNEL>>> {
    this.unsubscribe(this);
    return super.return();
  }

  map<OUTPUT>(
    transform: (input: ChannelData<CHANNEL>) => OUTPUT
  ): AsyncIterator<OUTPUT, undefined> {
    return new TransformAsyncIterator(this, transform);
  }
}
