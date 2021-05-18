import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import { useAuthenticatedUser } from 'src/hooksAndQueries/authenticatedUser';
import MenuBar from '../MenuBar/MenuBar';
import { useAuthenticatedUserTournamentsQuery, useRegisterTournamentInvitationLinkMutation } from '../../types/graphql';
import { InvitedTournamentsList } from './InvitedTournamentsList';
import { JoinedTournamentsList } from './JoinedTournamentsList';
import { useURIQuery } from 'src/utils/router/useURIQuery';
import { useHistory } from 'react-router';

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
    mainRow: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'

    },
    column: {
      flex: '1 1 auto',
      display: 'flex',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      marginTop: theme.spacing(25),
    }
  }),
);

export function UserHomePage() {
  const classes = useStyles();
  const { authenticatedUser } = useAuthenticatedUser();
  const { error, data: userTournaments, refetch: refetchUserTournaments } = useAuthenticatedUserTournamentsQuery();

  const history = useHistory()
  const [ registerTournamentInvitation, tournamentInvitationResult ] = useRegisterTournamentInvitationLinkMutation();
  const query = useURIQuery();
  const tournamentInvitationLinkID = query.get('tournament_invitation');
  useEffect(() => {
    if (tournamentInvitationLinkID) {
      query.delete('tournament_invitation')
      history.replace({
        search: query.toString(),
      })
      registerTournamentInvitation({
        variables: { tournamentInvitationLinkID }
      });
    }
  }, [tournamentInvitationLinkID, query, history, registerTournamentInvitation, refetchUserTournaments]);

  const [ invitationProcessed, setInvitationProcessed ] = useState(false);
  useEffect(() => {
    if (tournamentInvitationResult.data && !invitationProcessed) {
      setInvitationProcessed(true);
      refetchUserTournaments();
    }
  }, [tournamentInvitationResult.data, invitationProcessed, setInvitationProcessed, refetchUserTournaments]);

  return (
  <div className={classes.root}>
    <MenuBar />
    <Typography variant='h3' className={classes.welcomeTitle}>
      Welcome { authenticatedUser?.username }!
    </Typography>
    <div className={classes.mainRow}>
      <div className={classes.column}>
        <JoinedTournamentsList teams={userTournaments?.authenticatedUser?.teams}/>
      </div>
      <div className={classes.column}>
        <InvitedTournamentsList invitations={userTournaments?.authenticatedUser?.tournamentInvitations}/>
      </div>
    </div>
  </div>
  )
}