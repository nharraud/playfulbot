import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TeamID, TournamentID } from 'src/types/graphql';
import { useAuthenticatedUser } from 'src/hooksAndQueries/backend/graphql/authenticatedUser';
import TeamCard from './TeamCard';
import CreateTeamCard from './CreateTeamCard';
import { useMutation, useQuery } from '@apollo/client/react';
import { joinTeamMutation, tournamentTeamsQuery } from 'src/hooksAndQueries/backend/graphql/team';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   padding: theme.spacing(3),
  // },
}));

interface AllTeamsTabProps {
  tournamentID?: TournamentID;
  onJoinSuccess: () => void;
}

export default function AllTeamsTab(props: AllTeamsTabProps) {
  const classes = useStyles();
  const { data: tournamentTeams } = useQuery(tournamentTeamsQuery, {
    variables: {
      tournamentID: props.tournamentID as string,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { authenticatedUser } = useAuthenticatedUser();

  let content;

  const [joinTeam, joinResult] = useMutation(joinTeamMutation, {
    onCompleted: () => props.onJoinSuccess(),
  });

  const handleJoin = useCallback(
    (teamID: TeamID) => {
      if (!joinResult.loading) {
        joinTeam({ variables: { teamID } });
      }
    },
    [joinTeam, joinResult]
  );

  if (tournamentTeams && authenticatedUser) {
    const userTeam = tournamentTeams.tournament?.teams?.find(
      (team) => team?.members?.findIndex((member) => member?.id === authenticatedUser.id) !== -1
    );

    let otherTeams = tournamentTeams?.tournament?.teams;
    if (userTeam) {
      otherTeams = otherTeams?.filter((team) => team?.id !== userTeam.id);
    }

    content = otherTeams?.map((team) => (
      <Grid item xs={6} md={3} lg={2} key={team?.id}>
        <TeamCard team={team} onJoin={handleJoin} />
      </Grid>
    ));
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} lg={2}>
          <CreateTeamCard onCreate={props.onJoinSuccess} tournamentID={props.tournamentID} />
        </Grid>
        {content}
      </Grid>
    </div>
  );
}
