import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useAuthenticatedUser } from 'src/hooksAndQueries/authenticatedUser';
import MenuBar from '../MenuBar/MenuBar';
import { useAuthenticatedUserTournamentsQuery } from '../../types/graphql';
import { JoinedTournamentsList } from './JoinedTournamentsList';

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
  const { error, data: userTournaments } = useAuthenticatedUserTournamentsQuery();

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
        col2
      </div>
    </div>
  </div>
  )
}