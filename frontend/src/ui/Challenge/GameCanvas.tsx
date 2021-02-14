import React from 'react';
import { useContext } from 'react';

import { Canvas } from 'react-three-fiber';

import TicTacToe from '../../games/TicTacToe';

import { getApolloContext } from '@apollo/client/react/context/ApolloContext';


export default function GameCanvas(props) {

  const apolloContext = getApolloContext()
  const aplloContextValue = useContext(getApolloContext())
  return (
  <Canvas>
    <color attach="background" args={[0,0,0]} />
    <pointLight position={[10, -10, 10]} />
    <apolloContext.Provider value={aplloContextValue}>
      <TicTacToe {...props} />
    </apolloContext.Provider>
  </Canvas>
  );
}

