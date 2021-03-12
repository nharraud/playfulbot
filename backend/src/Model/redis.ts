import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

// export const redis = new Redis();

export const pubsub = new RedisPubSub({
  publisher: new Redis(),
  subscriber: new Redis(),
});

export function disconnect() {
  pubsub.getPublisher().disconnect();
  pubsub.getSubscriber().disconnect();
}