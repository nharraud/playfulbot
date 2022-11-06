import React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import Modal from '@mui/material/Modal';

import Popper from '@mui/material/Popper';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function DebugConfiguration(props) {
  return (
    <Dialog aria-labelledby="debug-configuration" open={true}>
      <DialogTitle id="debug-configuration">Configure bot debugging</DialogTitle>
    </Dialog>
  );
}
