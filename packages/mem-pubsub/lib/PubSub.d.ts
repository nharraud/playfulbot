import { ChannelListener } from './ChannelListener.js';
export declare class PubSub<ChannelData> {
    private channels;
    publish<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string, data: ChannelData[CHANNEL]): void;
    complete<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string): void;
    listen<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string): ChannelListener<ChannelData, CHANNEL>;
    hasListeners<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string): boolean;
    private getListeners;
    private static createKey;
    private unsubscribe;
}
//# sourceMappingURL=PubSub.d.ts.map