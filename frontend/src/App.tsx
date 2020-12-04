import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Container from '@material-ui/core/Container';

import logo from './logo.svg';
import './App.css';
import GameCanvas from './GameCanvas';
import Login from './ui/Login';
import Registration from './ui/Registration';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

import MenuBar from './ui/MenuBar';

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App" style={{height:"100%",width:"100%"}}>
      <Router>
      <MenuBar/>

      <Switch>
        <Route path="/game">
          <GameCanvas/>
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
    </ApolloProvider>
  );
}

export default App;
