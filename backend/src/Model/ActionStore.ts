import { PlayingTwice } from '~playfulbot/errors';
import { Action } from '~playfulbot/types/action';
import { GameID } from '~playfulbot/types/database';

const actionStore = new Map<GameID, Map<number, Action>>();

export function storeAction(id: GameID, action: Action): number {
  let gameStore = actionStore.get(id);
  if (gameStore == null) {
    gameStore = new Map<number, Action>();
    actionStore.set(id, gameStore);
  }
  if (gameStore.has(action.player)) {
    throw new PlayingTwice();
  }
  gameStore.set(action.player, action);
  return gameStore.size;
}

export function getStoredActions(id: GameID): Action[] {
  return Array.from(actionStore.get(id)?.values());
}

export function deleteGameStore(id: GameID): void {
  actionStore.delete(id);
}
