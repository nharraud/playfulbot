import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


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

export default function Registration(props) {
  const classes = useStyles();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitForm = event => {
    event.preventDefault()

    const options = {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password}`
    }
  }


  return (
    <div className={classes.root}>
      <Grid container xs={12} spacing={3} direction="row" justify="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>
            <form className={classes.form} noValidate autoComplete="off">
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Create an account
              </Typography>
              <Grid className={classes.formGrid} container xs={12} spacing={3} direction="row" justify="center">
                <Grid item xs={12}>
                  <TextField label="username" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField label="password" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField label="confirm password" variant="outlined" fullWidth />
                </Grid>
                <Grid item container xs={12} className={classes.formButtons}>
                  <Grid item container xs={6} justify="center">
                  <Button variant="contained" color="primary">
                    Register
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
  );
}