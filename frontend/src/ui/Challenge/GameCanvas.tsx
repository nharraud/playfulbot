import React, { Suspense } from 'react';
import { useContext } from 'react';

import { Canvas } from 'react-three-fiber';

import TicTacToe from '../../games/TicTacToe';
import ChefAuction from '../../games/ChefAuction';

import { getApolloContext } from '@apollo/client/react/context/ApolloContext';


export default function GameCanvas(props) {

  const apolloContext = getApolloContext()
  const aplloContextValue = useContext(getApolloContext())

  const loadingWidget = (
    <mesh
      rotation={[-10,-10,10]}
      position={[0,0,0]}
    >
      <boxBufferGeometry args={[1,1,1]} />
      <meshLambertMaterial color={'white'}/> 
    </mesh>
  );

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
      <Suspense fallback={loadingWidget}>
        {/* <TicTacToe {...props} /> */}
        <ChefAuction/>
      </Suspense>
    </apolloContext.Provider>
  </Canvas>
  );
}

