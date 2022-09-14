import { FrontendGameDefinition } from 'playfulbot-game-frontend';

declare module 'playfulbot-config' {
  export const gameDefinition: FrontendGameDefinition<any>;
}
