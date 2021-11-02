import { GameDefinition } from 'playfulbot-game';

declare module 'playfulbot-config' {
  export const gameDefinition: GameDefinition<any>;
}
