import React, { useState } from 'react';
import { useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import cssCls from './TeamArenasSubPage.module.css';
import { Link, useMatch } from 'react-router';
import { useArenaArenaSubscription, useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { RunnerClientProvider } from 'src/infrastructure/graphql/GraphqlClientProviders';
import { useGame } from 'src/hooksAndQueries/game-runner/graphql/useGame';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function ArenaSubPage(props: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/arenas/:arenaID');
  const arenaId = match?.params.arenaID;

  const result = useArenaArenaSubscription(arenaId);
  const createGame = useCreateArenaGame(arenaId);
  return (
    <div className={cssCls.arenas}>
      <p>{JSON.stringify(result.gameRef)}</p>
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

  const result = useGame(props.gameID);
  return (
    <div>
      <p>{JSON.stringify(result?.game)}</p>
    </div>
  );
}