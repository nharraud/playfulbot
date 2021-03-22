import React from 'react';
import { useLoader, Vector3 } from 'react-three-fiber';
import * as THREE from 'three'

export function Sprite(props: {texturePath: string, ratio: number, position: Vector3}) {
  const texture = useLoader(THREE.TextureLoader, props.texturePath);
  const size: [number, number] = [ texture.image.naturalWidth * props.ratio, texture.image.naturalHeight * props.ratio ];
  return (
    <mesh position={props.position}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshBasicMaterial attach="material" transparent map={texture} />
    </mesh>
  );
}
