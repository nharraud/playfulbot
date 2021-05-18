import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useTournamentByInvitationQuery } from '../../types/graphql-generated';
import MenuBar from '../MenuBar/MenuBar';

import {
  useHistory,
  useParams
} from 'react-router-dom';
import { TournamentInvitationID } from 'src/types/graphql';
import { containsNotFoundError } from 'src/hooksAndQueries/errors';
import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    }
  })
);

export function TournamentInvitationPage() {
  const classes = useStyles();

  const history = useHistory();
  const { tournamentInvitationID } = useParams<{tournamentInvitationID: TournamentInvitationID}>();
  const { authenticated } = useContext(UserContext);
  const { error: tournamentError, data: tournamentResult } = useTournamentByInvitationQuery({
    variables: {
      tournamentInvitationID: tournamentInvitationID
    }
  });

  let error;
  if (tournamentError && containsNotFoundError(tournamentError)) {
    error = (
      <Paper>
        <p>No Tournament matches the provided Invitation</p>
      </Paper>
    )
  }

  if (tournamentResult && !authenticated) {
    history.push(`/login?tournament_invitation=${tournamentInvitationID}`)
  }
  
  return (
    <div className={classes.root}>
      <MenuBar />
      {error}
    </div>
  )
}