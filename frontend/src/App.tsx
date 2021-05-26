import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import logo from './logo.svg';
import './App.css';
import GameCanvas from './ui/Tournament/GameCanvas';
import Login from './ui/Login';
import Registration from './ui/Registration';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

import TournamentPage from './ui/Tournament/TournamentPage';
import TournamentCreationPage from './ui/Tournament/TournamentCreationPage';
import { LandingPage } from './ui/LandingPage/LandingPage';
import { UserContextProvider } from './UserContext';
import { UserHomePage } from './ui/UserHomePage/UserHomePage';
import { AuthenticationRequired } from './AuthenticationRequired';
import { TournamentInvitationPage } from './ui/TournamentInvitation/TournamentInvitationPage';

import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    menu: Palette['primary'];
  }
  interface PaletteOptions {
    menu: PaletteOptions['primary'];
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#90caf9'
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
    }
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
    }
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={LuxonUtils}>
    <CssBaseline />
    <div className="App">
      <UserContextProvider>
        <Router>

        <Switch>
          <Route exact path="/">
            <LandingPage/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/register">
            <Registration/>
          </Route>

          <Route path="/tournament_invitation/:tournamentInvitationLinkID">
              <TournamentInvitationPage/>
            </Route>

          <AuthenticationRequired>
            <Route exact path="/home">
              <UserHomePage/>
            </Route>
            <Route path="/tournament/:tournamentID">
              <TournamentPage/>
            </Route>
            <Route path="/create_tournament">
              <TournamentCreationPage/>
            </Route>
          </AuthenticationRequired>

        </Switch>
        
        </Router>
      </UserContextProvider>
    </div>
    </MuiPickersUtilsProvider>
    </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
