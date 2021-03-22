import React, { memo, Suspense } from 'react';
import Text from 'src/Text';
import { Sprite } from './Sprite';

export default function TurnCounter(props) {
  return (
    <group {...props} >
      <Sprite texturePath={'/assets/ui/nailed_plank_dark_brown_3.png'} position={[0,0,0]} ratio={0.008}/>
      <Sprite texturePath={'/assets/icons/objects/hourglass.png'} position={[-0.6,0,1]} ratio={0.0035}/>
      <Text position={[0,-0.22,2]}>
          3
      </Text>
    </group>
  );
}
