import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Tournament } from 'src/types/graphql';
import useTeam from 'src/hooksAndQueries/useTeam';
import LoadingWidget from '../../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function TeamSubPage(props: { tournament: Tournament }) {
  const classes = useStyles();

  const { team, userNotPartOfAnyTeam, loading, error } = useTeam(props.tournament.id);

  if (loading) {
    return <LoadingWidget/>
  } else if (error) {
    return <p>{ error.message }</p>;
  }

  if (userNotPartOfAnyTeam) {
    return (
      <Button>Join team</Button>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6">
          Members of team "{team?.name}"
      </Typography>
      <ul>
      {team?.members.map((member) =>
        <li>{member.username}</li>
      )}
      </ul>
    </div>
  )
}