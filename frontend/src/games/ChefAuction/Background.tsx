import React from 'react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three'

export function Background() {
  const texturePath = '/assets/ui/board.png';
  const texture = useLoader(THREE.TextureLoader, texturePath);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  const size: [number, number] = [ texture.image.naturalWidth/30, texture.image.naturalHeight/30];
  return (
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshBasicMaterial attach="material" transparent map={texture} />
    </mesh>
  );
}
