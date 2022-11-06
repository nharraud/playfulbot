import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterUser } from 'src/hooksAndQueries/authenticatedUser';
import { Divider, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuBar from './MenuBar/MenuBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
    left: {
      backgroundColor: 'black',
    },
    formBox: {
      marginTop: theme.spacing(10),
    },
    form: {
      padding: theme.spacing(5),
      paddingBottom: theme.spacing(3),
      textAlign: 'left',
    },
    formGrid: {
      margin: 'auto',
    },
    formTitle: {
      paddingBottom: theme.spacing(3),
      textAlign: 'center',
    },
    registerButtonContainer: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    registerButton: {
      width: '100%',
      backgroundColor: theme.palette.success.main,
      color: theme.palette.getContrastText(theme.palette.success.main),
    },
    loginLinkContainer: {
      padding: theme.spacing(3),
    },
  })
);

interface Inputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  username: yup.string().max(15).min(3).required(),
  password: yup.string().min(5).max(50).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match!")
    .required(),
});

export default function Registration(props) {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const { registerUser, result } = useRegisterUser();

  const onSubmit = async (data: Inputs) => {
    registerUser(data.username, data.password);
  };

  return <>
    <MenuBar />
    <div className={classes.root}>
      <Grid container xs={12} spacing={3} direction="row" justifyContent="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>
            <form
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Create an account
              </Typography>
              <Grid
                className={classes.formGrid}
                container
                xs={12}
                spacing={3}
                direction="row"
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <TextField
                    inputRef={register}
                    label="username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    error={errors.username !== undefined}
                    helperText={errors.username?.message}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    type="password"
                    inputRef={register}
                    label="password"
                    name="password"
                    variant="outlined"
                    fullWidth
                    autoComplete="new-password"
                    error={errors.password !== undefined}
                    helperText={errors.password?.message}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    type="password"
                    inputRef={register}
                    label="confirm password"
                    name="confirmPassword"
                    variant="outlined"
                    fullWidth
                    autoComplete="new-password"
                    error={errors.confirmPassword !== undefined}
                    helperText={errors.confirmPassword?.message}
                  />
                </Grid>
                <Grid item xs={12} className={classes.registerButtonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.registerButton}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Divider variant="middle" />
            <div className={classes.loginLinkContainer}>
              <Typography variant="body1">
                You already have an account:{' '}
                <Link component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  </>;
}
