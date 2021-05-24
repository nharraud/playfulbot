import { makeStyles, createStyles, Theme, Typography, ListItem, ListItemText, List } from '@material-ui/core';
import React from 'react';
import { Tournament } from '../../types/graphql';
import { tournamentStatusToText } from 'src/modelHelpers/tournament';
import { Link } from 'react-router-dom';
import { NoTournamentFound } from './NoTournamentFound';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: '20rem',
    },
    title: {
      marginBottom: theme.spacing(5),
    },
    list: {
      backgroundColor: theme.palette.background.paper,
    },
    tournamentListItem: {
      color: 'inherit',
    }
  }),
);

export interface TournamentsListProps {
  title: string,
  tournaments?: Tournament[];
};

export function TournamentsList(props: TournamentsListProps) {
  const classes = useStyles();

  const tournamentListItems = props?.tournaments?.map((tournament) => {
    return (
      <ListItem className={classes.tournamentListItem} key={tournament.id}
        component={Link} to={`/tournament/${tournament.id}/info`}
      >
        <ListItemText
          primary={tournament.name}
          secondary={tournamentStatusToText(tournament)}
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
      {props.title}
    </Typography>
    {content}
  </div>
  )
}