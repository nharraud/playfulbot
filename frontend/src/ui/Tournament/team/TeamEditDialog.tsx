import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Team, useCreateTeamMutation, useUpdateTeamMutation } from 'src/types/graphql-generated';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TournamentID } from 'src/types/graphql';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.down('xl')]: {
      width: '100%',
    },
    margin: '1rem',
  },
}));

interface TeamCreateOrEditDialogProps {
  team?: Team;
  open: boolean;
  title: string;
  alert: JSX.Element;
  action: 'Create' | 'Save';
  handleClose: () => void;
  onSubmit: (data: Inputs) => unknown;
}

interface Inputs {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().max(15).min(3).required(),
});

function TeamCreateOrEditDialog({
  team,
  open,
  title,
  action,
  alert,
  handleClose,
  onSubmit,
}: TeamCreateOrEditDialogProps) {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: team,
  });

  useEffect(() => {
    if (open) {
      reset(team);
    }
  }, [team, reset, open]);

  const onCancel = useCallback(() => handleClose(), [handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{ className: classes.dialogPaper }}
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {alert}
          <TextField
            inputRef={register}
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Team name"
            type="text"
            fullWidth
            error={errors.name !== undefined}
            helperText={errors.name?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
            {action}
          </Button>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export interface TeamCreateDialogProps {
  tournamentID: TournamentID;
  open: boolean;
  handleClose: (team?: Team) => void;
}

export function TeamCreateDialog({ tournamentID, open, handleClose }: TeamCreateDialogProps) {
  const [alert, setAlert] = useState(undefined);
  useEffect(() => {
    if (open) {
      setAlert(undefined);
    }
  }, [setAlert, open]);

  const [createTeam] = useCreateTeamMutation({
    onCompleted: (data) => {
      if (data?.createTeam?.__typename === 'CreateTeamSuccess') {
        handleClose(data.createTeam.team);
      } else if (data?.createTeam?.__typename === 'CreateTeamFailure') {
        setAlert(
          <Alert severity="error">
            An unexpected error occured: {data.createTeam.errors[0].message}
          </Alert>
        );
      }
    },
  });

  const onSubmit = async (data: Inputs) => {
    createTeam({
      variables: {
        tournamentID,
        input: { name: data.name },
      },
    });
  };

  return (
    <TeamCreateOrEditDialog
      title={'Create Team'}
      action="Create"
      open={open}
      alert={alert}
      handleClose={handleClose}
      onSubmit={onSubmit}
    />
  );
}

export interface TeamEditDialogProps {
  team?: Team;
  open: boolean;
  handleClose: (team?: Team) => void;
}

export function TeamEditDialog({ team, open, handleClose }: TeamEditDialogProps) {
  const [alert, setAlert] = useState(undefined);
  useEffect(() => {
    if (open) {
      setAlert(undefined);
    }
  }, [setAlert, open]);

  const [updateTeam] = useUpdateTeamMutation({
    onCompleted: (data) => {
      if (data?.updateTeam?.__typename === 'UpdateTeamSuccess') {
        handleClose(data.updateTeam.team);
      } else if (data?.updateTeam?.__typename === 'UpdateTeamFailure') {
        setAlert(
          <Alert severity="error">
            An unexpected error occured: {data.updateTeam.errors[0].message}
          </Alert>
        );
      }
    },
  });

  const onSubmit = async (data: Inputs) => {
    updateTeam({
      variables: {
        teamID: team.id,
        input: { name: data.name },
      },
    });
  };

  return (
    <TeamCreateOrEditDialog
      title={'Edit Team'}
      action="Save"
      open={open}
      team={team}
      alert={alert}
      handleClose={handleClose}
      onSubmit={onSubmit}
    />
  );
}
