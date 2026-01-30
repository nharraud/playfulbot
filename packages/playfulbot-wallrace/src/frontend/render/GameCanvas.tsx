import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GameRendererProps } from 'playfulbot-game-frontend';
import { Game } from './Game';
import { WallRaceGameState } from '../../types';

export interface GameCanvasProps extends GameRendererProps<WallRaceGameState> {
  gameState: WallRaceGameState,
}

export function GameCanvas(props: GameCanvasProps) {
  let game;
  if (props?.gameState !== undefined) {
    game = (<Game {...props} />)
  }
  return (
  <Canvas
    orthographic
    camera={{
      position: [0, 0, 4],
      near: 0.1,
      far: 5,
  }}
  >
    <color attach="background" args={[0,0,0]} />
    <ambientLight/>
    { game }
  </Canvas>
  );
}
