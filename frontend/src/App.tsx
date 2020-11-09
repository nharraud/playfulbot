import React from 'react';
import { Profiler } from 'react';
import logo from './logo.svg';
import './App.css';
import { Books } from './Books';

import { ApolloProvider } from '@apollo/client';
import { client } from './apolloConfig';

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
    <Profiler id="Books" onRender={(...props)=> {console.log(props);}}>
      <Books/>
      </Profiler>
    </div>
    </ApolloProvider>
  );
}

export default App;
