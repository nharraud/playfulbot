import { FrontendGameDefinition } from 'playfulbot-game-frontend';

declare module 'playfulbot-config' {
  export const gameDefinitionLoaders: Record<string, () => Promise<FrontendGameDefinition<any>>>;
}
