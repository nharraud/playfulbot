import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import { useLoader } from 'react-three-fiber'

function Text(props) {
  const font = useLoader(THREE.FontLoader, '/Roboto_Bold.json')
  const config = useMemo(() => ({ font, size: 0.5, height: 0.05 }), [font])
  return (
    <group
     {...props} >
      <mesh>
        <textGeometry args={[props.children as string, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
}

export default Text