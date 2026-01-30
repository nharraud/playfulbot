import React, { useMemo } from 'react';
import { a } from '@react-spring/three';
import * as THREE from 'three';

interface BikenProps {
  position: [number, number, number]
  color: string
}

export default function Bike(props: BikenProps) {
  const emissiveColor = useMemo(() => new THREE.Color('#ffffff'), [])
  return (
    <a.mesh position={props.position} layers={1}>
      <boxGeometry attach='geometry' args={[1, 1, 2]} />
      <meshStandardMaterial
        attach='material'
        color={props.color}
        emissive={emissiveColor}
        emissiveIntensity={20}
        opacity={0.4}
        transparent
      />
    </a.mesh>
  )
}
