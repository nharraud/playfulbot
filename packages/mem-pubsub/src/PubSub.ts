// import { ChannelName, ChannelData } from './messages';
import { ChannelListener } from './ChannelListener';

export class PubSub<ChannelData> {
  private channels = new Map<string, Set<ChannelListener<ChannelData, any>>>();

  publish<CHANNEL extends keyof ChannelData>(
    channel: CHANNEL,
    subChannel: string,
    data: ChannelData[CHANNEL]
  ): void {
    const listeners = this.getListeners(channel, subChannel);
    if (listeners) {
      listeners.forEach((listener) => listener.push(data));
    }
  }

  complete<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string): void {
    const listeners = this.getListeners(channel, subChannel);
    if (listeners) {
      listeners.forEach((listener) => listener.complete());
    }
    this.channels.delete(PubSub.createKey(channel, subChannel));
  }

  listen<CHANNEL extends keyof ChannelData>(
    channel: CHANNEL,
    subChannel: string
  ): ChannelListener<ChannelData, CHANNEL> {
    const newListener = new ChannelListener<ChannelData, CHANNEL>(
      channel,
      subChannel,
      this.unsubscribe
    ) as ChannelListener<ChannelData, CHANNEL>;

    const key = PubSub.createKey(channel, subChannel);
    let listeners = this.channels.get(key);
    if (!listeners) {
      listeners = new Set<ChannelListener<ChannelData, CHANNEL>>();
      this.channels.set(key, listeners);
    }
    listeners.add(newListener);
    return newListener as ChannelListener<ChannelData, CHANNEL>;
  }

  hasListeners<CHANNEL extends keyof ChannelData>(channel: CHANNEL, subChannel: string): boolean {
    const key = PubSub.createKey(channel, subChannel);
    return this.channels.has(key);
  }

  private getListeners<CHANNEL extends keyof ChannelData>(
    channel: CHANNEL,
    subChannel: string
  ): ChannelListener<ChannelData, CHANNEL>[] {
    return this.channels.get(
      PubSub.createKey(channel, subChannel)
    ) as unknown as ChannelListener<ChannelData, CHANNEL>[];
  }

  private static createKey(
    channel: any,
    subChannel: string
  ): string {
    return `${channel}-${subChannel}`;
  }

  private unsubscribe = (listener: ChannelListener<ChannelData, any>): void => {
    const key = PubSub.createKey(listener.channel, listener.subChannel);
    const listeners = this.channels.get(key);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.channels.delete(key);
      }
    }
  };
}
