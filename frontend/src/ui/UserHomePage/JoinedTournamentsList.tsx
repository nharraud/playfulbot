import { makeStyles, createStyles, Theme, Typography, ListItem, ListItemText, List } from '@material-ui/core';
import React from 'react';
import { Team } from '../../types/graphql';
import { tournamentStatusToText } from 'src/modelHelpers/tournament';
import { Link } from 'react-router-dom';


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

export interface JoinedTournamentsListProps {
  teams?: Team[];
};

export function JoinedTournamentsList(props: JoinedTournamentsListProps) {
  const classes = useStyles();

  const tournamentListItems = props?.teams?.map((team) => {
    return (
      <ListItem className={classes.tournamentListItem} key={team.tournament.id}
        component={Link} to={`/tournament/${team.tournament.id}/info`}
      >
        <ListItemText
          primary={team.tournament.name}
          secondary={tournamentStatusToText(team.tournament)}
        />
      </ListItem>
    )
  });

  return (
  <div className={classes.root}>
    <Typography variant="h6" className={classes.title}>
      Tournaments you joined
    </Typography>
    <List  className={classes.list}>
      {tournamentListItems}
    </List>
  </div>
  )
}