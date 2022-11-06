import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import LuxonUtils from '@date-io/luxon';
import { ApolloProvider } from '@apollo/client';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import logo from './logo.svg';
import './App.css';
import Login from './ui/Login';
import Registration from './ui/Registration';

import { client } from './apolloConfig';

import TournamentPage from './ui/Tournament/TournamentPage';
import TournamentCreationPage from './ui/Tournament/TournamentCreationPage';
import { LandingPage } from './ui/LandingPage/LandingPage';
import { UserContextProvider } from './UserContext';
import { UserHomePage } from './ui/UserHomePage/UserHomePage';
import { AuthenticationRequired } from './AuthenticationRequired';
import { TournamentInvitationPage } from './ui/TournamentInvitation/TournamentInvitationPage';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


declare module '@mui/material/styles/createPalette' {
  interface Palette {
    menu: Palette['primary'];
    code: PaletteOptions['text'];
  }
  interface PaletteOptions {
    menu: PaletteOptions['primary'];
    code: PaletteOptions['text'];
  }
}

const theme = createTheme(adaptV4Theme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ef5350',
    },
    menu: {
      main: '#3f51b5',
      dark: '#303f9f',
    },
    background: {
      default: '#212121',
      paper: '#353535',
    },
    code: {
      primary: '#ffa657',
    },
  },
  typography: {
    h1: {
      fontSize: '2.3rem',
      fontWeight: 400,
    },
    h2: {
      fontSize: '2.0rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
  },
}));

function App() {
  return (
    <ApolloProvider client={client}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <CssBaseline />
            <div className="App">
              <UserContextProvider>
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <LandingPage />
                    </Route>
                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/register">
                      <Registration />
                    </Route>

                    <Route path="/tournament_invitation/:tournamentInvitationLinkID">
                      <TournamentInvitationPage />
                    </Route>

                    <AuthenticationRequired>
                      <Route exact path="/home">
                        <UserHomePage />
                      </Route>
                      <Route path="/tournament/:tournamentID">
                        <TournamentPage />
                      </Route>
                      <Route path="/create_tournament">
                        <TournamentCreationPage />
                      </Route>
                    </AuthenticationRequired>
                  </Switch>
                </Router>
              </UserContextProvider>
            </div>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  );
}

export default App;
