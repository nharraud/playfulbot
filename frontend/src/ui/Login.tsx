import React, { useContext, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuBar from './MenuBar/MenuBar';
import { useAuthenticatedUser, useLogin } from '../hooksAndQueries/authenticatedUser';
import { UserContext } from 'src/UserContext';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';


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
      paddingBottom: theme.spacing(3),
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
      marginTop: theme.spacing(1)
    },
    loginButton: {
      width: '100%',
    },
    registerButton: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.getContrastText(theme.palette.success.main),
    },
    registerButtonContainer: {
      padding: theme.spacing(3),
    }
  }),
);


export default function Login(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, result } = useLogin();
  const { authenticated } = useContext(UserContext);

  const submitLogin = event => {
    event.preventDefault();
    login(username, password);
  }

  return (
    <>
    <MenuBar />
    <div className={classes.root}>
      { result.error ? JSON.stringify(result.error): null}
      <Grid container xs={12} spacing={3} direction="row" justify="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>
            <form className={classes.form} noValidate autoComplete="off"
              onSubmit={submitLogin}>
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Login
              </Typography>
              <Grid className={classes.formGrid} container xs={12} spacing={3} direction="row" justify="center">
                <Grid item xs={12}>
                  <TextField label="username" variant="outlined" fullWidth
                    onChange={event => setUsername(event.target.value)} />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField label="password" variant="outlined" fullWidth 
                    onChange={event => setPassword(event.target.value)} />
                </Grid>
                <Grid item container xs={12} className={classes.formButtons} justify="center">
                  <Button variant="contained" color="primary" type="submit" className={classes.loginButton}>
                    login
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Divider variant="middle" />
            <div className={classes.registerButtonContainer}>
              <Button component={Link} to='/register' variant='contained' className={classes.registerButton}>
                Create New Account
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
    </>
  );
}
