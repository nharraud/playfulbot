import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameCanvas from './GameCanvas';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App" style={{height:"100%",width:"100%"}}>
      <GameCanvas/>
    </div>
    </ApolloProvider>
  );
}

export default App;
