import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import Modal from '@material-ui/core/Modal';

import Popper from '@material-ui/core/Popper';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export default function DebugConfiguration(props) {
    return (
        <Dialog aria-labelledby="debug-configuration" open={true}>
        <DialogTitle id="debug-configuration">Configure bot debugging</DialogTitle>
        </Dialog>

    //     <Modal
    //     open={true}
    //     aria-labelledby="simple-modal-title"
    //     aria-describedby="simple-modal-description"
    //     >
    //         <p>This is a test</p>
    //     </Modal>
    // <Popper open={true} anchorEl={props.anchor}>
    //     <Paper>
    //         This is a test
    //     </Paper>
    // </Popper>
    );
}