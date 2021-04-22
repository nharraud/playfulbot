import { ChannelName, ChannelData, ChannelMessages } from './messages';
import { ChannelListener } from './ChannelListener';

export class PubSub {
  private channels = new Map<string, Set<ChannelListener<ChannelName>>>();

  publish<CHANNEL extends ChannelName>(
    channel: CHANNEL,
    subChannel: string,
    data: ChannelData<CHANNEL>
  ): void {
    const listeners = this.getListeners(channel, subChannel);
    if (listeners) {
      listeners.forEach((listener) => listener.push(data));
    }
  }

  complete<CHANNEL extends ChannelName>(channel: CHANNEL, subChannel: string): void {
    const listeners = this.getListeners(channel, subChannel);
    if (listeners) {
      listeners.forEach((listener) => listener.complete());
    }
    this.channels.delete(PubSub.createKey(channel, subChannel));
  }

  listen<CHANNEL extends ChannelName>(
    channel: CHANNEL,
    subChannel: string
  ): ChannelListener<CHANNEL> {
    const newListener = (new ChannelListener<CHANNEL>(
      channel,
      subChannel,
      this.unsubscribe
    ) as unknown) as ChannelListener<ChannelName>;

    const key = PubSub.createKey(channel, subChannel);
    let listeners = this.channels.get(key);
    if (!listeners) {
      listeners = new Set<ChannelListener<ChannelName>>();
      this.channels.set(key, listeners);
    }
    listeners.add(newListener);
    return (newListener as unknown) as ChannelListener<CHANNEL>;
  }

  hasListeners<CHANNEL extends ChannelName>(channel: CHANNEL, subChannel: string): boolean {
    const key = PubSub.createKey(channel, subChannel);
    return this.channels.has(key);
  }

  private getListeners<CHANNEL extends ChannelName>(
    channel: CHANNEL,
    subChannel: string
  ): ChannelListener<CHANNEL>[] {
    return (this.channels.get(
      PubSub.createKey(channel, subChannel)
    ) as unknown) as ChannelListener<CHANNEL>[];
  }

  private static createKey<CHANNEL extends ChannelName>(
    channel: CHANNEL,
    subChannel: string
  ): string {
    return `${channel}-${subChannel}`;
  }

  private unsubscribe = (listener: ChannelListener<any>): void => {
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

export const pubsub = new PubSub();
