import React, { useRef, useEffect, useMemo } from 'react';

import * as THREE from 'three'
import { useThree, useFrame, extend } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
// import { WaterPass } from 'three/examples/jsm/postprocessing/WaterPass'

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { Node } from 'react-three-fiber/three-types'

extend({ EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, FilmPass, GlitchPass, BokehPass })

export type EffectComposerProps = Node<EffectComposer, typeof EffectComposer>
export type RenderPassProps = Node<RenderPass, typeof RenderPass>
export type UnrealBloomPassProps = Node<UnrealBloomPass, typeof UnrealBloomPass>
export type FilmPasssProps = Node<FilmPass, typeof FilmPass>
export type GlitchPassProps = Node<GlitchPass, typeof GlitchPass>
export type BokehPassProps = Node<BokehPass, typeof BokehPass>

declare global {
    namespace JSX {
      interface IntrinsicElements {
        effectComposer: EffectComposerProps,
        renderPass: RenderPassProps,
        unrealBloomPass: UnrealBloomPassProps,
        filmPass: FilmPasssProps,
        glitchPass: GlitchPassProps,
        bokehPass: BokehPassProps,
      }
    }
}

export function Bloom({ children }) {
  const { gl, camera, size } = useThree()
  const scene: any = useRef()
  const composer: any = useRef()
  useEffect(() => {
    composer.current = new EffectComposer(gl)
    composer.current.addPass(new RenderPass(scene.current, camera))
    composer.current.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 1.5, 1, 0))
  }, [gl, camera, size.height, size.width])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return <scene ref={scene}>{children}</scene>
}

export function Main({ children }) {
    const scene = useRef()
    const { gl, camera } = useThree()
    useFrame(() => void ((gl.autoClear = false), gl.clearDepth(), gl.render(scene.current, camera)), 2)
    return <scene ref={scene}>{children}</scene>
  }



export function Effect() {
    const composer: any = useRef()
    const { scene, gl, size, camera } = useThree()
    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    useFrame(() => composer.current.render(), 1)
    return (
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        {/* <waterPass attachArray="passes" factor={2} /> */}
        <unrealBloomPass attachArray="passes" args={[aspect, 1, 0.1, 0]} />
        {/* <filmPass attachArray="passes" args={[0.25, 0.4, 1500, 0]} /> */}
        {/* <glitchPass attachArray="passes" /> */}
        {/* <bokehPass attachArray="passes" args={[scene, camera, {focus:1}]}/> */}
      </effectComposer>
    )
  }