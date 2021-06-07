import React, { useEffect} from 'react';
import { WallRaceGameState } from './types';
import { useThree } from 'react-three-fiber';
import Grid from './Grid';
import { Wall } from './Wall';
import { PLAYER_COLORS } from './player';

import { EffectComposer, SelectiveBloom } from 'react-postprocessing'

interface GamePropsInterface {
  game: {
    gameState: WallRaceGameState;
  };
}
export function Game(props: GamePropsInterface) {
  // rescale the arena to fit the screen
  const scale = 1 / props.game.gameState.arena.size * 6;
  // translate the arena in order to start the origin on the bottom left corner
  const translation = props.game.gameState.arena.size / 2;

  const { camera } = useThree();

  useEffect(() => {
    camera.layers.enable(0);
    // Enable layer 1 on which "Bike"s will be rendered with a bloom filter
    camera.layers.enable(1);
  }, [camera]);

  return (
    <group position={[-translation * scale, -translation * scale, 0]} scale={[scale, scale, 1]}>
      <group position={[0,0,1]}>
      {props.game.gameState.walls.map((points, index) =>
        <Wall points={points} key={index} color={PLAYER_COLORS[index]}/>
      )}
      </group>
      <group position={[0,0,0]}>
      <Grid size={props.game.gameState.arena.size}/>
      </group>

      <EffectComposer>
        <SelectiveBloom luminanceThreshold={0.1} luminanceSmoothing={0.8} height={300} selectionLayer={1} />
      </EffectComposer>
    </group>
  );
}
