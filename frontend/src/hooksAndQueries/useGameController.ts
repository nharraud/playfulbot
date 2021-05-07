import { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "src/types/gameState";
import { Game } from "src/types/graphql-generated";
import { applyPatch, Operation } from 'fast-json-patch';
import { NoUndefinedVariablesRule } from "graphql";
import { GameID } from "src/types/graphql";

export interface ControlledGame {
  id: GameID;
  gameState: GameState;
  version: number;
}

export type SetGameVersion = (version: number) => void;

function patchStateToVersion(
  game: Game, finalVersion: number, currentControlledGame?: ControlledGame
): ControlledGame {
  let startVersion: number;
  let startState: GameState;
  if (currentControlledGame !== undefined && currentControlledGame.version <= finalVersion) {
    startVersion = currentControlledGame.version;
    startState = currentControlledGame.gameState;
  } else {
    startVersion = 0;
    startState = game.initialState;
  }
  for (let patch = startVersion; patch < finalVersion; ++patch) {
    startState = applyPatch(startState, game.patches[patch], false, false).newDocument;
  }
  return { id: game.id, gameState: startState, version: finalVersion };
}

export function useGameController(game?: Game) {
  // const displayedGame = useRef<DisplayedGame>(undefined);
  const [gameVersion, setGameVersion] = useState(0);
  const [controlledGame, setControlledGame] = useState<ControlledGame>(undefined);

  useEffect(() => {
    if (game !== undefined) {
      if (controlledGame === undefined) {
        setControlledGame(patchStateToVersion(game, gameVersion));
      } else if (controlledGame.id !== game.id) {
        setGameVersion(0);
        setControlledGame(patchStateToVersion(game, 0));
      } else if (controlledGame.version !== gameVersion) {
        setControlledGame(patchStateToVersion(game, gameVersion, controlledGame));
      }
    }
  }, [game, controlledGame, gameVersion])

  return { controlledGame, setGameVersion };
}
