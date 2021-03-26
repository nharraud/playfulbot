
import React, { useMemo } from 'react';
import * as THREE from 'three'
import { useTrail } from '@react-spring/core'
import { a } from '@react-spring/three';

interface GridPropsInterface {
  size: number
}
export default function Grid(props: GridPropsInterface) {
  const trail = useTrail(props.size + 1, {
    from: { color: '#000000' },
    to: {color:  '#58f4f4'},
    config: { mass: 10, tension: 500, friction: 2, clamp: true }
  })
  
  const rows = useMemo(() => new Array(props.size + 1).fill(0).map((_, index) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-0.5, index - 0.5, 0), new THREE.Vector3(props.size - 0.5, index - 0.5, 0)]
    )
    return (
    // @ts-ignore
    <a.line key={index} geometry={lineGeometry}>
      <a.lineBasicMaterial color={trail[index].color} linewidth={100}/>
    </a.line>
    )
  }), [props.size, trail]);

  const columns = useMemo(() => new Array(props.size + 1).fill(0).map((_, index) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(index - 0.5, -0.5, 0), new THREE.Vector3(index - 0.5, props.size - 0.5, 0)]
    )
    return (
    // @ts-ignore
    <a.line key={index} geometry={lineGeometry}>
      <a.lineBasicMaterial color={trail[index].color} linewidth={100}/>
    </a.line>
    )
  }), [props.size, trail]);

  return (
    <group>
      {rows}
      {columns}
    </group>
  )
}