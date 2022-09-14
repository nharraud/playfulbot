import React, { useEffect, useState } from 'react';
import { WallRaceGameState } from '../../types';
import { useThree } from '@react-three/fiber';
import Grid from './Grid';
import { Wall } from './Wall';
import { PLAYER_COLORS } from './player';

import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'

interface GamePropsInterface {
  gameState: WallRaceGameState;
}
export function Game(props: GamePropsInterface) {
  // rescale the arena to fit the screen
  const [ scale, setScale ] = useState(0);
  const [ translation, setTranslation ] = useState(0);
  const { camera, viewport } = useThree();
  useEffect(() => {
    const minViewPort = viewport.width < viewport.height ? viewport.width : viewport.height;
    const ratio = minViewPort / props.gameState.arena.size * 0.9;
    setScale(ratio);
    setTranslation((props.gameState.arena.size) / 2 * ratio);
  }, [viewport, props.gameState.arena.size]);

  useEffect(() => {
    camera.layers.enable(0);
    // Enable layer 1 on which "Bike"s will be rendered with a bloom filter
    camera.layers.enable(1);
  }, [camera]);

  return (
    <group
        position={[-translation, -translation, 0]}
        scale={[scale, scale, 1]}>
      <group position={[0,0,1]}>
      {props.gameState.walls.map((points, index) =>
        <Wall points={points} key={index} color={PLAYER_COLORS[index]}/>
      )}
      </group>
      <group position={[0,0,0]}>
      <Grid size={props.gameState.arena.size}/>
      </group>

      <EffectComposer>
        <SelectiveBloom luminanceThreshold={0.1} luminanceSmoothing={0.8} height={300} selectionLayer={1} />
      </EffectComposer>
    </group>
  );
}
