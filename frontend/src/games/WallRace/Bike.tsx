import React, { useMemo } from 'react';
import { Coordinate } from './types';
import { a } from 'react-spring/three';
import * as THREE from 'three';

interface BikenProps {
  position: Coordinate
  color: string
}

export default function Bike(props: BikenProps) {
  const emissiveColor = useMemo(() => new THREE.Color('#ffffff'), [])
  return (
    <a.mesh position={props.position} layers={1}>
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <meshStandardMaterial
        attach='material'
        color={props.color}
        emissive={emissiveColor}
        emissiveIntensity={100}
        opacity={0.4}
        transparent
      />
    </a.mesh>
  )
}
