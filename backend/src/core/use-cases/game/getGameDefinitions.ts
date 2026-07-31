import { Context } from "~playfulbot/core/use-cases/interfaces/Context";

export interface GameDefinitionSummary {
  id: string;
  name: string;
}

export async function getGameDefinitions(ctx: Context<any>): Promise<GameDefinitionSummary[]> {
  const gameDefinitions = await ctx.providers.gameDefinitions.getGameDefinitions();
  return Array.from(gameDefinitions.entries()).map(([id, gameDefinition]) => ({
    id,
    name: gameDefinition.name,
  }));
}
