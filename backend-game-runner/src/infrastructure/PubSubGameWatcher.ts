import { GameWatcher } from "~game-runner/core/entities/GameWatcher";
import { pubsub } from '~game-runner/infrastructure/pubsub';

import { JSONPatch } from "~game-runner/core/entities/base-types";

export class PubSubGameWatcher implements GameWatcher {
  notifyGameCancelled(gameId: string, version: number): void {
    pubsub.publish('GAME_CHANGED', gameId, {
      canceled: true,
      version,
    });
    pubsub.complete('GAME_CHANGED', gameId);
  }

  notifyGameStateChanged(gameId: string, version: number, patch: JSONPatch, winners?: number[]): void {
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