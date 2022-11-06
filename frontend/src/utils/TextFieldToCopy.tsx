import React from 'react';

import copy from 'copy-to-clipboard';
import { Divider, IconButton, Paper, InputBase } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2px 4px',

    backgroundColor: theme.palette.grey[700],
  },
  input: {
    flex: '1 1 auto',
  },
  divider: {
    height: 28,
    margin: 4,
    flex: '0 0 auto',
  },
  button: {
    flex: '0 0 auto',
  },
}));

type PropsType = {
  text: string;
  format?: string;
};

export default function TextFieldToCopy({ text, format = 'text/plain' }: PropsType) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <InputBase
        type="text"
        defaultValue={text}
        inputProps={{ readOnly: true }}
        className={classes.input}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.button}
        onClick={() => copy(text, { format })}
        aria-label="directions"
        size="large">
        <FileCopyIcon />
      </IconButton>
    </Paper>
  );
}
