import { AsyncStream } from './AsyncStream.js';
export declare class ChannelListener<ChannelData, CHANNEL extends keyof ChannelData> extends AsyncStream<ChannelData[CHANNEL]> {
    readonly channel: CHANNEL;
    readonly subChannel: string;
    readonly unsubscribe: (listener: ChannelListener<any, any>) => void;
    constructor(channel: CHANNEL, subChannel: string, unsubscribe: (listener: ChannelListener<any, any>) => void);
    return(): Promise<IteratorResult<ChannelData[CHANNEL]>>;
    map<OUTPUT>(transform: (input: ChannelData[CHANNEL]) => OUTPUT): AsyncIterator<OUTPUT, undefined>;
}
//# sourceMappingURL=ChannelListener.d.ts.map