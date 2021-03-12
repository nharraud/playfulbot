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
import GameCanvas from './ui/Challenge/GameCanvas';
import Login from './ui/Login';
import Registration from './ui/Registration';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

import MenuBar from './ui/MenuBar';
import ChallengePage from './ui/Challenge/ChallengePage';
import TournamentCreationPage from './ui/Challenge/TournamentCreationPage';

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
    <div className="App" style={{height:"100%",width:"100%"}}>
      <Router>

      <Switch>
        <Route path="/tournament/:tournamentID">
          <ChallengePage/>
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
