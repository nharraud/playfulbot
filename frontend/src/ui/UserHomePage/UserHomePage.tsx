import React, { useEffect, useState } from 'react';
import { Theme, Typography, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { useAuthenticatedUser } from 'src/hooksAndQueries/authenticatedUser';
import { useURIQuery } from 'src/utils/router/useURIQuery';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';
import {
  useAuthenticatedUserTournamentsQuery,
  useRegisterTournamentInvitationLinkMutation,
} from '../../types/graphql';
import { TournamentsList } from './TournamentsList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    welcomeTitle: {
      flex: '0 0 auto',
      marginTop: theme.spacing(5),
    },
    createTournamentRow: {
      marginTop: theme.spacing(10),
    },
    createTournamentButton: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.getContrastText(theme.palette.success.main),
    },
    tournamentListsRow: {
      marginTop: theme.spacing(10),
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
    },
    column: {},
  })
);

export function UserHomePage() {
  const classes = useStyles();
  const { authenticatedUser } = useAuthenticatedUser();
  const {
    error,
    data: userTournaments,
    refetch: refetchUserTournaments,
  } = useAuthenticatedUserTournamentsQuery();

  const history = useHistory();
  const [registerTournamentInvitation, tournamentInvitationResult] =
    useRegisterTournamentInvitationLinkMutation();
  const query = useURIQuery();
  const tournamentInvitationLinkID = query.get('tournament_invitation');
  useEffect(() => {
    if (tournamentInvitationLinkID) {
      query.delete('tournament_invitation');
      history.replace({
        search: query.toString(),
      });
      registerTournamentInvitation({
        variables: { tournamentInvitationLinkID },
      });
    }
  }, [
    tournamentInvitationLinkID,
    query,
    history,
    registerTournamentInvitation,
    refetchUserTournaments,
  ]);

  const [invitationProcessed, setInvitationProcessed] = useState(false);
  useEffect(() => {
    if (tournamentInvitationResult.data && !invitationProcessed) {
      setInvitationProcessed(true);
      refetchUserTournaments();
    }
  }, [
    tournamentInvitationResult.data,
    invitationProcessed,
    setInvitationProcessed,
    refetchUserTournaments,
  ]);

  const jointedTournaments = userTournaments?.authenticatedUser?.teams?.map(
    (team) => team.tournament
  );
  const invitedTournaments = userTournaments?.authenticatedUser?.tournamentInvitations?.map(
    (invitation) => invitation.tournament
  );
  const organizedTournaments = userTournaments?.authenticatedUser?.organizedTournaments;

  return (
    <div className={classes.root}>
      <MenuBar />
      <Typography variant="h3" className={classes.welcomeTitle}>
        Welcome {authenticatedUser?.username}! Here are your tournaments.
      </Typography>
      <div className={classes.createTournamentRow}>
        <Button
          variant="contained"
          component={Link}
          to="/create_tournament"
          className={classes.createTournamentButton}
        >
          Create a new Tournament
        </Button>
      </div>
      <div className={classes.tournamentListsRow}>
        <div className={classes.column}>
          <TournamentsList
            title="Tournaments you are invited to"
            tournaments={invitedTournaments}
          />
        </div>
        <div className={classes.column}>
          <TournamentsList title="Tournaments you joined" tournaments={jointedTournaments} />
        </div>
        <div className={classes.column}>
          <TournamentsList title="Tournaments you organize" tournaments={organizedTournaments} />
        </div>
      </div>
    </div>
  );
}
