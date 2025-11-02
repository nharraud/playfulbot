import React, { useState } from 'react';
import { useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import cssCls from './TeamArenasSubPage.module.css';
import { Link, useMatch } from 'react-router';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function TeamArenasSubPage(props: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/:page');
  const baseURL = `/tournament/${match?.params?.tournamentID}/${match?.params?.page}`;

  const result = useTeamArenas(props.tournament?.id);
  const arenasElt = result.arenas?.map(arena =>
    <Link to={`${baseURL}/${arena.id}`} className={cssCls.arena}>
      <div>{arena.name}</div>
    </Link>
  );
  return (
    <div className={cssCls.arenas}>
      {arenasElt}
    </div>
  );
}
