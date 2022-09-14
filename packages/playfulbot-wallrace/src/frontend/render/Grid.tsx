
import React, { useMemo } from 'react';
import * as THREE from 'three'
import { useTrail } from 'react-spring'
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
      [new THREE.Vector3(0, index, 0), new THREE.Vector3(props.size, index, 0)]
    )
    return (
    // @ts-ignore
    <a.line key={index} geometry={lineGeometry}>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <a.lineBasicMaterial color={trail[index].color as any} linewidth={1}/>
    </a.line>
    )
  }), [props.size, trail]);

  const columns = useMemo(() => new Array(props.size + 1).fill(0).map((_, index) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(index, 0, 0), new THREE.Vector3(index, props.size, 0)]
    )
    return (
    // @ts-ignore
    <a.line key={index} geometry={lineGeometry}>
      <a.lineBasicMaterial color={trail[index].color as any} linewidth={1}/>
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