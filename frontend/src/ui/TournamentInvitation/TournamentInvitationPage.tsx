import React, { useContext, useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { TournamentInvitationID } from 'src/types/graphql';
import { containsNotFoundError } from 'src/hooksAndQueries/errors';
import { Paper, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import MenuBar from '../MenuBar/MenuBar';
import { useTournamentByInvitationLinkQuery } from '../../types/graphql-generated';
import { UserContext } from '../../UserContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
);

export function TournamentInvitationPage() {
  const classes = useStyles();

  const history = useHistory();
  const { tournamentInvitationLinkID } = useParams<{
    tournamentInvitationLinkID: TournamentInvitationID;
  }>();
  const { authenticated } = useContext(UserContext);
  const { error: tournamentError, data: tournamentResult } = useTournamentByInvitationLinkQuery({
    variables: {
      tournamentInvitationLinkID,
    },
  });

  let error;
  if (tournamentError && containsNotFoundError(tournamentError)) {
    error = (
      <Paper>
        <p>No Tournament matches the provided Invitation</p>
      </Paper>
    );
  }

  useEffect(() => {
    if (tournamentResult) {
      if (!authenticated) {
        history.push(`/login?tournament_invitation=${tournamentInvitationLinkID}`);
      } else {
        history.push(`/home?tournament_invitation=${tournamentInvitationLinkID}`);
      }
    }
  }, [history, tournamentResult, authenticated, tournamentInvitationLinkID]);

  return (
    <div className={classes.root}>
      <MenuBar />
      {error}
    </div>
  );
}
