import { AsyncStream } from './AsyncStream.js';
// import { ChannelData, ChannelName } from './messages.js';
import { TransformAsyncIterator } from './TransformAsyncIterator.js';
export class ChannelListener extends AsyncStream {
    channel;
    subChannel;
    unsubscribe;
    constructor(channel, subChannel, unsubscribe) {
        super();
        this.channel = channel;
        this.subChannel = subChannel;
        this.unsubscribe = unsubscribe;
    }
    return() {
        this.unsubscribe(this);
        return super.return();
    }
    map(transform) {
        return new TransformAsyncIterator(this, transform);
    }
}
//# sourceMappingURL=ChannelListener.js.map