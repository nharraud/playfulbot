import { Dialog, makeStyles } from '@material-ui/core';
import React from 'react';
import { config } from 'src/config';
import { TournamentInvitationID } from 'src/types/graphql';
import { ClosableDialogTitle } from 'src/utils/Dialog/ClosableDialogTitle';
import { DialogContent } from 'src/utils/Dialog/DialogContent';
import TextFieldToCopy from 'src/utils/TextFieldToCopy';

const useStyles = makeStyles((theme) => ({
  description: {
    paddingBottom: theme.spacing(1),
  }
}));

function tournamentInvitationIDToURL(invitationID: TournamentInvitationID) {
  return `${config.FRONTEND_URL}/tournament_invitation/${invitationID}`
}

interface TeamInviteModalProps {
  open: boolean
  handleClose: () => void,
  invitationLinkID: TournamentInvitationID,
};

export function TeamInviteDialog(props: TeamInviteModalProps) {
  const classes = useStyles();
  return (
    <Dialog onClose={props.handleClose} aria-labelledby="team-invite-dialog-title" open={props.open}>
    <ClosableDialogTitle id="team-invite-dialog-title" onClose={props.handleClose}>Invite Players</ClosableDialogTitle>
      <DialogContent dividers>
        <p id="team-invite-modal-description" className={classes.description}>
          Send the following link to people you want to invite. Once registered they will be able to create or join a team.
        </p>
        <TextFieldToCopy text={tournamentInvitationIDToURL(props.invitationLinkID)}/>
      </DialogContent>
    </Dialog>
  );
}
