import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Books } from './Books';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
      <Books/>
    </div>
    </ApolloProvider>
  );
}

export default App;
