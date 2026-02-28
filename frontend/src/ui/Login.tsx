import { useContext, useActionState } from 'react';
import { UserContext } from 'src/UserContext';
import { Link, Navigate } from 'react-router-dom';
import { useLogin } from '../hooksAndQueries/backend/graphql/authenticatedUser';
import cssCls from './Login.module.css';
import formCssCls from 'src/ui/components/form/Form.module.css';
import { Card } from './components/card/Card';
import { FormattedMessage } from 'react-intl';
import { isFailure } from 'src/hooksAndQueries/backend/graphql/isFailure';
import { useFormStatus } from 'react-dom';
import { FormSubmit } from './components/form/FormSubmit';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      <FormattedMessage defaultMessage='Sign in'/>
    </button>
  );
}


export default function Login() {
  const { login } = useLogin();
  const { authenticated } = useContext(UserContext);

  const submitLogin = async (prevState: unknown, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const result = await login(username, password);
    return { error: isFailure(result?.data?.login) }
  };

  const [loginResult, loginAction] = useActionState(submitLogin, null);

  if (authenticated) {
    return <Navigate to={'/home'} replace />;
  }

  let errorMessage;
  if (loginResult?.error) {
    errorMessage = <FormattedMessage defaultMessage='Invalid Credentials' />
  }

  return (
    <div className={cssCls.loginPage}>
      <div className={cssCls.rootContainer}>
        <div className={cssCls.loginContainer}>
          <Link to={'/'} className={cssCls.header}>
            <h1>Playfulbot</h1>
          </Link>
          <Card>
            <h2>
              <FormattedMessage
                description='Login message welcoming back the user'
                defaultMessage='Welcome back'
              />
            </h2>
            <p className={cssCls.subtitle}>
              <FormattedMessage
                defaultMessage='Sign in to your account to continue'
              />
            </p>
            <form className={formCssCls.form} action={loginAction}>
              <p className={formCssCls.formError}>
                {errorMessage}
              </p>
              <div>
                <label htmlFor='username'>
                    <FormattedMessage
                      defaultMessage='User name'
                    />
                </label>
                <input name="username" id="username"/>
              </div>
              <div>
                <label htmlFor='password'>
                    <FormattedMessage
                      defaultMessage='Password'
                    />
                </label>
                <input name="password" id="password" type='password'/>
              </div>
              <FormSubmit className={cssCls.submitButton}>
                <FormattedMessage defaultMessage='Sign in'/>
              </FormSubmit>
            </form>
          </Card>
        </div>
      </div>
      {/* {result.error ? JSON.stringify(result.error) : null} */}
      {/* <div className={cssCls.panel}> */}
        {/* <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>
            <form className={classes.form} noValidate autoComplete="off" onSubmit={submitLogin}>
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Login
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
                    label="username"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    type="password"
                    label="password"
                    variant="outlined"
                    fullWidth
                    autoComplete="current-password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Grid>
                <Grid item container xs={12} className={classes.formButtons} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.loginButton}
                  >
                    login
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Divider variant="middle" />
            <div className={classes.registerButtonContainer}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                className={classes.registerButton}
              >
                Create New Account
              </Button>
            </div>
          </Paper>
        </Grid> */}
      {/* </div> */}
    </div>
  );
}
