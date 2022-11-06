import React from 'react';

import { Theme } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import MuiDialogContent from '@mui/material/DialogContent';

export const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
