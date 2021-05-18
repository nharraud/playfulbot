import { makeStyles, createStyles, Theme, Typography, ListItem, ListItemText, List } from '@material-ui/core';
import React from 'react';
import { TournamentInvitation } from '../../types/graphql';
import { tournamentStatusToText } from 'src/modelHelpers/tournament';
import { Link } from 'react-router-dom';
import { NoTournamentFound } from './NoTournamentFound';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    list: {
      backgroundColor: theme.palette.background.paper,
    },
    tournamentListItem: {
      color: 'inherit',
    }
  }),
);

export interface InvitedTournamentsListProps {
  invitations?: TournamentInvitation[];
};

export function InvitedTournamentsList(props: InvitedTournamentsListProps) {
  const classes = useStyles();

  const tournamentListItems = props?.invitations?.map((invitation) => {
    return (
      <ListItem className={classes.tournamentListItem} key={invitation.tournament.id}
        component={Link} to={`/tournament/${invitation.tournament.id}/info`}
      >
        <ListItemText
          primary={invitation.tournament.name}
          secondary={tournamentStatusToText(invitation.tournament)}
        />
      </ListItem>
    )
  });
  let content = (
  <List  className={classes.list}>
    {tournamentListItems}
  </List>
  )
  if (tournamentListItems !== undefined && tournamentListItems.length === 0) {
    content = (<NoTournamentFound/>)
  }

  return (
  <div className={classes.root}>
    <Typography variant="h6" className={classes.title}>
      Tournaments you are invited to
    </Typography>
    {content}
  </div>
  )
}