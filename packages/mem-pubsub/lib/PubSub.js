// import { ChannelName, ChannelData } from './messages.js';
import { ChannelListener } from './ChannelListener.js';
export class PubSub {
    channels = new Map();
    publish(channel, subChannel, data) {
        const listeners = this.getListeners(channel, subChannel);
        if (listeners) {
            listeners.forEach((listener) => listener.push(data));
        }
    }
    complete(channel, subChannel) {
        const listeners = this.getListeners(channel, subChannel);
        if (listeners) {
            listeners.forEach((listener) => listener.complete());
        }
        this.channels.delete(PubSub.createKey(channel, subChannel));
    }
    listen(channel, subChannel) {
        const newListener = new ChannelListener(channel, subChannel, this.unsubscribe);
        const key = PubSub.createKey(channel, subChannel);
        let listeners = this.channels.get(key);
        if (!listeners) {
            listeners = new Set();
            this.channels.set(key, listeners);
        }
        listeners.add(newListener);
        return newListener;
    }
    hasListeners(channel, subChannel) {
        const key = PubSub.createKey(channel, subChannel);
        return this.channels.has(key);
    }
    getListeners(channel, subChannel) {
        return this.channels.get(PubSub.createKey(channel, subChannel));
    }
    static createKey(channel, subChannel) {
        return `${channel}-${subChannel}`;
    }
    unsubscribe = (listener) => {
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
//# sourceMappingURL=PubSub.js.map