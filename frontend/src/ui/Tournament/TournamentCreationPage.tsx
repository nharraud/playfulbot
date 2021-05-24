import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import MenuBar from '../MenuBar/MenuBar';
import { useCreateTournament } from 'src/hooksAndQueries/createTournament';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
    left: {
      backgroundColor: 'black'
    },
    formBox: {
      marginTop: theme.spacing(10),
    },
    form: {
      padding: theme.spacing(5),
      textAlign: 'left'
    },
    formGrid: {
      margin: 'auto'
    },
    formTitle: {
      paddingBottom: theme.spacing(3),
      textAlign: 'center'
    },
    formButtons: {
      marginTop: theme.spacing(2)
    }
  }),
);

interface Inputs {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().max(15).min(5).required(),
});

export default function TournamentCreationPage(props) {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(schema)
  });

  const { createTournament, result } = useCreateTournament();

  let history = useHistory();

  if (result?.data) {
    history.push(`/tournament/${result.data.createTournament.id}/info`);
  }

  const onSubmit = async (data: Inputs) => {
    createTournament(data.name);
  };
  console.log(result);

  return (
    <>
    <MenuBar showTournaments={true} />
    <div className={classes.root}>
      <Grid container xs={12} spacing={3} direction="row" justify="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>

            <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Create a tournament
              </Typography>
              <Grid className={classes.formGrid} container xs={12} spacing={3} direction="row" justify="center">
                <Grid item xs={12}>
                  <TextField inputRef={register} label="name" name="name" variant="outlined" fullWidth
                    error={errors?.name !== undefined} helperText={errors?.name?.message}
                  />
                </Grid>
                <Grid item container xs={12} className={classes.formButtons}>
                  <Grid item container xs={6} justify="center">
                  <Button variant="contained" color="primary" type="submit">
                    Create
                  </Button>
                  </Grid>
                  <Grid item container xs={6} justify="center">
                  <Button variant="contained" color="secondary">
                    Cancel
                  </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>

          </Paper>
        </Grid>
      </Grid>
    </div>
    </>
  );
}