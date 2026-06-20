import React, { useState } from 'react';
import { useArena, useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import { Link, useMatch } from 'react-router';
import { useArenaArenaSubscription, useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { RunnerClientProvider } from 'src/infrastructure/graphql/GraphqlClientProviders';
import { ArenaHeader } from './ArenaHeader';
import { GameArenaDisplay } from './GameArenaDisplay';
import cssCls from './ArenaPage.module.css';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function ArenaPage({ tournament }: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/arenas/:arenaID');
  const arenaId = match?.params.arenaID;

  const { arena, error } = useArena(arenaId);

  const result = useArenaArenaSubscription(arenaId);
  return (
    <div className={cssCls.pageContainer}>
      <ArenaHeader arenaName={arena?.name} tournamentId={tournament?.id}/>
      {/* <p>{JSON.stringify(result.gameRef)}</p> */}
      <div className={cssCls.arenaContainer}>
        <RunnerClientProvider runnerUrl={result.gameRef?.graphqlUrl}>
          <GameArenaDisplay gameID={result.gameRef?.gameID} arenaId={arenaId}/>
        </RunnerClientProvider>
      </div>
    </div>
  );
}

