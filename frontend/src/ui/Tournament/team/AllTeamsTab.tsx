import React, { useCallback } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { TeamID, TournamentID, useJoinTeamMutation } from 'src/types/graphql';
import { useTournamentTeamsQuery } from '../../../types/graphql';
import TeamCard from './TeamCard';
import { useAuthenticatedUser } from 'src/hooksAndQueries/authenticatedUser';
import CreateTeamCard from './CreateTeamCard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));


interface AllTeamsTabProps {
  tournamentID?: TournamentID;
  onJoinSuccess: () => void
};

export default function AllTeamsTab(props: AllTeamsTabProps) {
  const classes = useStyles();
  const { data: tournamentTeams } = useTournamentTeamsQuery({
    variables: {
      tournamentID: props.tournamentID,
    },
    fetchPolicy: "cache-and-network"
  });
  const { authenticatedUser } = useAuthenticatedUser();

  let content;

  const [joinTeam, joinResult ] = useJoinTeamMutation({
    onCompleted: () => props.onJoinSuccess(),
  });

  const handleJoin = useCallback((teamID: TeamID) => {
    if (!joinResult.loading) {
      joinTeam({ variables: { teamID } });
    }
  }, [joinTeam, joinResult]);

  if (tournamentTeams && authenticatedUser) {
    const userTeam = tournamentTeams.tournament.teams.find((team) =>
      team.members.findIndex((member) => member.id === authenticatedUser.id) !== -1
    )

    let otherTeams = tournamentTeams.tournament.teams;
    if (userTeam) {
      otherTeams = otherTeams.filter((team) => team.id !== userTeam.id);
    }

    content = otherTeams
    .map((team) => (
      <Grid item xs={6} md={3} lg={2} key={team.id}>
        <TeamCard team={team} onJoin={handleJoin}/>
      </Grid>
    ))
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} lg={2}>
          <CreateTeamCard onCreate={props.onJoinSuccess} tournamentID={props.tournamentID}/>
        </Grid>
        {content}
      </Grid>
    </div>
  )
}