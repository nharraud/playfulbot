import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Tournament } from 'src/types/graphql';
import useTeam from 'src/useTeam';
import LoadingWidget from '../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function TeamSubPage(props: { tournament: Tournament }) {
  const classes = useStyles();

  const { team, loading, error } = useTeam(props.tournament.id);
  console.log(error);

  if (loading) {
    return <LoadingWidget/>
  } else if (error) {
    return <p>{ error.message }</p>;
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