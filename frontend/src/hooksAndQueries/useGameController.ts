import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState } from 'playfulbot-game';
import { Game } from 'src/types/graphql-generated';
import { applyPatch, Operation } from 'fast-json-patch';
import { NoUndefinedVariablesRule } from 'graphql';
import { GameID } from 'src/types/graphql';

export interface ControlledGame {
  id: GameID;
  gameState: GameState;
  version: number;
  maxVersion: number;
}

export type SetGameVersion = (version: number) => void;

function patchStateToVersion(
  game: Game,
  finalVersion: number,
  currentControlledGame?: ControlledGame
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
  return {
    id: game.id,
    gameState: startState,
    version: finalVersion,
    maxVersion: game.version,
  };
}

export interface useGameControllerResult {
  controlledGame: ControlledGame;
  setGameVersion: SetGameVersion;
}

export function useGameController(game?: Game): useGameControllerResult {
  // const displayedGame = useRef<DisplayedGame>(undefined);
  const [gameVersion, setGameVersionInternal] = useState(0);
  const [followLastVersion, setFollowLastVersion] = useState(true);
  const [controlledGame, setControlledGame] = useState<ControlledGame>(undefined);

  const setGameVersion = useCallback(
    (gameVersion) => {
      setFollowLastVersion(gameVersion === game.version);
      setGameVersionInternal(gameVersion);
    },
    [game?.version]
  );

  useEffect(() => {
    if (game !== undefined) {
      if (controlledGame === undefined) {
        setControlledGame(patchStateToVersion(game, gameVersion));
      } else if (controlledGame.id !== game.id) {
        setGameVersion(game.version);
        setControlledGame(patchStateToVersion(game, game.version));
      } else {
        let newVersion = gameVersion;
        if (followLastVersion && gameVersion !== game.version) {
          setGameVersionInternal(game.version);
          newVersion = game.version;
        }
        if (controlledGame.version !== newVersion) {
          setControlledGame(patchStateToVersion(game, newVersion, controlledGame));
        } else if (controlledGame.maxVersion !== game.version) {
          setControlledGame({ ...controlledGame, maxVersion: game.version });
        }
      }
    }
  }, [game, game?.version, controlledGame, gameVersion, followLastVersion, setGameVersion]);

  return { controlledGame, setGameVersion };
}
