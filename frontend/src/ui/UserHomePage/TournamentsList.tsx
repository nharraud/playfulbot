import React from 'react';
import { tournamentStatusToText } from 'src/modelHelpers/tournament';
import { Link, NavLink } from 'react-router-dom';
import { Tournament } from '../../types/graphql';
import { NoTournamentFound } from './NoTournamentFound';
import { useAuthenticatedUser } from 'src/hooksAndQueries/backend/graphql/authenticatedUser';
import { useAuthenticatedUserTournaments } from 'src/hooksAndQueries/backend/graphql/authenticatedUserTournaments';

import cssCls from './TournamentList.module.css';
import CardCssCls from '../components/card/Card.module.css';

export interface TournamentsListItemProps {
  tournament: Pick<Tournament, "id" | "name" | "status">;
}

function TournamentListItem({ tournament, }: TournamentsListItemProps) {
  return (
    <NavLink
      to={`/tournament/${tournament.id}/info`}
      className={`${cssCls.tournamentListItem} ${CardCssCls.card}`}
      key={tournament.id}>
        <div className={cssCls.listItemTop}>
          <div className={cssCls.listItemTopLeft}>
            <h3>{tournament.name}</h3>          
          </div>
          <div className={cssCls.arrow}/>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-5 h-5 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1 ml-4" data-fg-arl50="43.195:46.2438:/src/app/components/TournamentsList.tsx:170:17:6691:177:e:ArrowRight::::::s5N"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> */}
        </div>
    </NavLink>
  );
}

export function TournamentsList() {
  const { authenticatedUser } = useAuthenticatedUser();
  const {
    error,
    data: userTournaments,
    refetch: refetchUserTournaments,
  } = useAuthenticatedUserTournaments();
  const joinedTournaments = userTournaments?.authenticatedUser?.teams?.map(
    (team) => team.tournament
  );
  const invitedTournaments = userTournaments?.authenticatedUser?.tournamentInvitations?.map(
    (invitation) => invitation.tournament
  );
  const organizedTournaments = userTournaments?.authenticatedUser?.organizedTournaments;

  const allTournaments = [...(invitedTournaments || []), ...(organizedTournaments || []), ...(joinedTournaments || [])];
  const uniqueTournamentsMap = new Map(allTournaments.map(tournament => [tournament?.id, tournament]));
  const uniqueTournaments = uniqueTournamentsMap.values();
  const organizedTournamentIds = new Set(organizedTournaments?.map(tournament => tournament.id));
  const invitedTournamentIds = new Set(invitedTournaments?.map(tournament => tournament.id));
  const joinedTournamentIds = new Set(joinedTournaments?.map(tournament => tournament.id));

  if (allTournaments.length === 0) {
    return <NoTournamentFound />;
  }
  
  const tournamentListItems = allTournaments?.map((tournament) => (
    <TournamentListItem
      tournament={tournament}
    />
  ));
  return <div className={cssCls.tournamentList}>{tournamentListItems}</div>;
}
