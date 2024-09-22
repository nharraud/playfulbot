import { pubsub } from '~game-runner/infrastructure/pubsub';
export class PubSubGameWatcher {
    notifyGameCancelled(gameId, version) {
        pubsub.publish('GAME_CHANGED', gameId, {
            canceled: true,
            version,
        });
        pubsub.complete('GAME_CHANGED', gameId);
    }
    notifyGameStateChanged(gameId, version, patch, winners) {
        pubsub.publish('GAME_CHANGED', gameId, {
            version,
            patch,
            winners,
        });
        if (winners) {
            pubsub.complete('GAME_CHANGED', gameId);
        }
    }
}
//# sourceMappingURL=PubSubGameWatcher.js.map