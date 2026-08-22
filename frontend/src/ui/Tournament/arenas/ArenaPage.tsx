import React, { useState } from 'react';
import { useArena, useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import { Link, useMatch } from 'react-router';
import { useArenaGamesSubscription, useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { RunnerClientProvider } from 'src/infrastructure/graphql/GraphqlClientProviders';
import { ArenaHeader } from './ArenaHeader';
import { GameArenaDisplay } from './GameArenaDisplay';
import cssCls from './ArenaPage.module.scss';
import { FormattedMessage } from 'react-intl';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function ArenaPage({ tournament }: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/arenas/:arenaID');
  const arenaId = match?.params.arenaID;

  const { arena, error } = useArena(arenaId);
  
  const newGameText = (<FormattedMessage
    defaultMessage="New game"
  />);
  const createGame = useCreateArenaGame(arena?.id);

  const { gameRef, loading } = useArenaGamesSubscription(arenaId);

  let createGameButton;
  if (!gameRef) {
    createGameButton = (<button className={cssCls.createGameButton} onClick={createGame}>{newGameText}</button>)
  }
  return (
    <div className={cssCls.pageContainer}>
      <ArenaHeader arenaName={arena?.name} tournamentId={tournament?.id}/>
      {/* <p>{JSON.stringify(result.gameRef)}</p> */}
      {createGameButton}
      <div className={cssCls.arenaContainer}>
        <RunnerClientProvider runnerUrl={gameRef?.graphqlUrl}>
          <GameArenaDisplay gameID={gameRef?.gameID} arena={arena} createGame={createGame} gameDefinitionId={tournament?.gameDefinitionId}/>
        </RunnerClientProvider>
      </div>
    </div>
  );
}

