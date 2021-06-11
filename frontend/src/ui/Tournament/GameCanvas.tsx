import React from 'react';
import { useContext } from 'react';

import { Canvas } from 'react-three-fiber';

import { getApolloContext } from '@apollo/client/react/context/ApolloContext';
import { ControlledGame } from 'src/hooksAndQueries/useGameController';
import { GameDefinition } from 'src/games/GameDefinition';

interface GameCanvasProps {
  game: ControlledGame
  gameDefinition: GameDefinition,
}

export default function GameCanvas(props: GameCanvasProps) {

  const apolloContext = getApolloContext()
  const aplloContextValue = useContext(getApolloContext())

  let game;
  if (props?.game !== undefined) {
    game = (<props.gameDefinition.game {...props} />)
  }
  return (
  <Canvas
  orthographic
  colorManagement
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
      {/* <TicTacToe {...props} /> */}
      { game }
    </apolloContext.Provider>
  </Canvas>
  );
}
