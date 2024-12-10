import { GameDefinitionID } from 'playfulbot-config-loader';
import { BackendGameDefinition } from 'playfulbot-game-backend';

export interface GameDefinitionProvider {
  getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>>;
}
