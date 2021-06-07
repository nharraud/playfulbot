import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    code: {
      color: theme.palette.code.primary,
    }
  })
);

export function CodeTypo({children}: {children: string}) {
  const classes = useStyles();
  return (
    <span className={classes.code}>{children}</span>
  );
}