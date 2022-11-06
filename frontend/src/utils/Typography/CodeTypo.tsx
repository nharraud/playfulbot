import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    code: {
      color: theme.palette.code.primary,
    },
  })
);

export function CodeTypo({ children }: { children: string }) {
  const classes = useStyles();
  return <span className={classes.code}>{children}</span>;
}
