import React, { useState } from 'react';
import { useArena, useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import { Link, useMatch } from 'react-router';
import { useArenaArenaSubscription, useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { RunnerClientProvider } from 'src/infrastructure/graphql/GraphqlClientProviders';
import { useGame } from 'src/hooksAndQueries/game-runner/graphql/useGame';
import { useGameController } from 'src/hooksAndQueries/useGameController';
import { gameDefinition } from 'playfulbot-config';
import { Header } from 'src/ui/components/header/Header';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function ArenaPage(props: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/arenas/:arenaID');
  const arenaId = match?.params.arenaID;

  const { arena, error } = useArena(arenaId);

  const result = useArenaArenaSubscription(arenaId);
  const createGame = useCreateArenaGame(arenaId);
  return (
    <div>
      <Header title={arena?.name || error?.message} backLink={ {url: 'foo', text: 'bar' }}/>
      {/* <p>{JSON.stringify(result.gameRef)}</p> */}
      <RunnerClientProvider runnerUrl={result.gameRef?.graphqlUrl}>
        <GameWidget gameID={result.gameRef?.gameID}/>
      </RunnerClientProvider>
      <a onClick={createGame}>createGame</a>
    </div>
  );
}


interface GameWidgetProps {
  gameID?: string
}

function GameWidget(props: GameWidgetProps) {
  const gameResult = useGame(props.gameID);
  const  { controlledGame, setGameVersion } = useGameController(gameResult?.game);

  return (
    <div>
      {/* <p>{JSON.stringify(gameResult?.game?.players)}</p>
      <p>{JSON.stringify(controlledGame)}</p> */}
      <gameDefinition.game gameState={controlledGame?.gameState} />
      <br/>
      <input
        type='range' id='version' name='version' min='0'
        max={controlledGame?.maxVersion?.toString() || '0'}
        value={controlledGame?.version?.toString() || '0'}
        onChange={e => setGameVersion(parseInt(e.target.value, 10))}
      />
    </div>
  );
}