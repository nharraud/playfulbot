import React from 'react';
import { useContext } from 'react';

import { Canvas } from 'react-three-fiber';

import TicTacToe from '../../games/TicTacToe';

import { getApolloContext } from '@apollo/client/react/context/ApolloContext';


export default function GameCanvas(props) {

  const apolloContext = getApolloContext()
  const aplloContextValue = useContext(getApolloContext())
  return (
  <Canvas orthographic
    camera={{
      position: [0, 0, 30],
      zoom: 100,
      near: 0.1,
      far: 31,
  }}
  >
    <color attach="background" args={[0,0,0]} />
    <ambientLight/>
    <apolloContext.Provider value={aplloContextValue}>
      <TicTacToe {...props} />
    </apolloContext.Provider>
  </Canvas>
  );
}

