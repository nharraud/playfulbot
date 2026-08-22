import { useEffect, useState } from 'react';
import { gameDefinitionLoaders } from 'playfulbot-config';
import { FrontendGameDefinition } from 'playfulbot-game-frontend';

export function useGameDefinition(gameDefinitionId?: string | null): FrontendGameDefinition<any> | undefined {
  const [gameDefinition, setGameDefinition] = useState<FrontendGameDefinition<any> | undefined>(undefined);

  useEffect(() => {
    setGameDefinition(undefined);
    if (!gameDefinitionId) {
      return;
    }
    const loadGameDefinition = gameDefinitionLoaders[gameDefinitionId];
    if (!loadGameDefinition) {
      return;
    }
    let cancelled = false;
    loadGameDefinition().then(loadedGameDefinition => {
      if (!cancelled) {
        setGameDefinition(loadedGameDefinition);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [gameDefinitionId]);

  return gameDefinition;
}
