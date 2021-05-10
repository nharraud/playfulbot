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

import MenuBar from './ui/MenuBar';
import TournamentPage from './ui/Tournament/TournamentPage';
import TournamentCreationPage from './ui/Tournament/TournamentCreationPage';
import { LandingPage } from './ui/LandingPage/LandingPage';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App">
      <Router>

      <Switch>
      <Route exact path="/">
          <LandingPage/>
        </Route>
        <Route path="/tournament/:tournamentID">
          <TournamentPage/>
        </Route>
        <Route path="/create_tournament">
          <TournamentCreationPage/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/register">
          <Registration/>
        </Route>
      </Switch>

      
      </Router>
    </div>
    </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
