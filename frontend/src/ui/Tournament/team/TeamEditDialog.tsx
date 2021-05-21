import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Team, useUpdateTeamMutation } from 'src/types/graphql-generated';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    margin: '1rem',
  }
}));

export interface TeamData {
  name: string,
};

export interface TeamEditDialogProps {
  team?: Team,
  open: boolean,
  action: 'create' | 'update',
  handleClose: (team?: Team) => void,
}

interface Inputs {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().max(15).min(3).required(),
});

export default function TeamEditDialog({ team, open, handleClose, action }: TeamEditDialogProps) {
  const classes = useStyles();
  const [ alert, setAlert ] = useState(undefined);
  const { register, handleSubmit, errors, reset } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: team,
  });

  useEffect(() => {
    if (open) {
      reset(team);
      setAlert(undefined);
    }
  }, [team, reset, open]);

  const [ updateTeam, result ] = useUpdateTeamMutation();
  const [ hasUpdated, setHasUpdated ] = useState(false);

  const onSubmit = async (data: Inputs) => {
    setHasUpdated(true);
    updateTeam({
      variables: {
        teamID: team.id,
        input: { name: data.name },
      }
    });
  };

  useEffect(() => {
    if (hasUpdated) {
      if (result.data?.updateTeam?.__typename === 'UpdateTeamSuccess') {
        handleClose(result.data.updateTeam.team);
        setHasUpdated(false);
      } else if (result.data?.updateTeam?.__typename === 'UpdateTeamFailure') {
        setAlert(
          <Alert severity="error">An unexpected error occured: {result.data.updateTeam.errors[0].message}</Alert>
        );
        setHasUpdated(false);
      }
    }

  }, [result, handleClose, hasUpdated]);

  let title;
  if (action === 'create') {
    title = 'Create Team';
  } else {
    title = 'Edit Team';
  }

  const onCancel = useCallback(() => handleClose(), [handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
      PaperProps={{className: classes.dialogPaper}}
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          { alert }
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
            { action === 'create' ? 'Create' : 'Save'}
          </Button>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
