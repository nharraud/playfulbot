import { FrontendGameDefinition } from 'playfulbot-game-frontend';

declare module 'playfulbot-config' {
  export const gameDefinitions: Record<string, FrontendGameDefinition<any>>;
}
