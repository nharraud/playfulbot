import React, { useRef, useEffect, Suspense, useState } from 'react';
import useGame from '../useGame';
import Text from '../Text';

import { a, useSpring, config } from 'react-spring/three'

import { Bloom, Main, Effect } from '../Bloom';


export default function TicTacToe() {
    const { playAction, loading, error, data } = useGame();

    function fillSpace(idx) {
      playAction("fillSpace", {space: idx})
    }

    const [reverse, setReverse] = useState(false)
    const { color, emissiveIntensity } = useSpring({
      from: { color: [0,0,0], emissiveIntensity: 0 },
      to: { color: [255,255,0], emissiveIntensity: 3 },
      reverse: reverse,
      // config: { mass: 1, tension: 400, friction: 50, precision: 0.01 },
      config: config.default,
      onRest: () => {
        setReverse(!reverse)
      }
  });


    const loadingWidget = (
      <group>
        <Main>
        <ambientLight />
        <pointLight />
        <mesh
            rotation={[-10,-10,10]}
            position={[-1,-1,0]}
          >
            <boxBufferGeometry args={[1,1,1]} />
            <meshLambertMaterial color={'white'}/> 
          </mesh>
        <mesh
            rotation={[-10,-10,10]}
            position={[1,0.5,-10]}
          >
            <boxBufferGeometry args={[1,1,1]} />
            <meshLambertMaterial color={'red'}/> 
          </mesh>

        </Main>
        <Bloom>
          <ambientLight />
          <mesh
            rotation={[-10,-10,10]}
            position={[1,0,0]}
          >
            <boxBufferGeometry args={[1,1,1]} />
            <meshLambertMaterial color={'white'}/> 
          </mesh>
        </Bloom>
      </group>
    );

    const loadingWidget1 = (
      <group>

      <pointLight position={[0,0,5]} /*distance={10} */ intensity={10} color="lightblue"/>
        <mesh
          rotation={[-10,-10,10]}
          position={[1,0,0]}
        >
          <boxBufferGeometry args={[1,1,1]} />
          {/* <a.meshLambertMaterial color={color} />  */}

          {/* <meshBasicMaterial attach="material" color="lightblue" transparent /> */}
        {/* <meshStandardMaterial attach="material" color="#020000" roughness={0.8} metalness={0.1} /> */}
        {/* <a.meshStandardMaterial attach="material" color="#020000"
          emissiveIntensity={emissiveIntensity} emissive={color}
          roughness={0.8} metalness={0.1} /> */}

        <a.meshPhysicalMaterial attach="material" color="#f20000"
          // emissiveIntensity={emissiveIntensity} emissive={color}
          reflectivity={0.01} transmission={0} ior={1}
          roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh
          rotation={[-10,-10,10]}
          position={[-1,-1,0]}
        >
          <boxBufferGeometry args={[1,1,1]} />
          <meshLambertMaterial color='#009f00' reflectivity={0} refractionRatio={0} lightMapIntensity={0} emissiveIntensity={0} aoMapIntensity={0}/>
        </mesh>
        <Effect/>
      </group>
    );
  
    if (loading || error) return loadingWidget;
    console.log(data)
  
    return (
      loadingWidget
      // <Suspense fallback={loadingWidget}>
      // <group>
      //   <Text position={[-2.3,2,0]}>
      //     Tic Tac Toe
      //   </Text>
      //   {
      //     data.game.grid.map((cell, index) => {
      //       if (cell === "x") {
      //         return (
      //           <group
      //             key={index}
      //             rotation={[0,0,Math.PI/4]}
      //             position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
      //           >
      //             <mesh
      //               position={[0,0,0]}
      //             >
      //               <boxBufferGeometry args={[0.1,1,0.1]} />
      //               <meshLambertMaterial color={'green'}/> 
      //             </mesh>
      //             <mesh
      //               position={[0,0,0]}
      //             >
      //               <boxBufferGeometry args={[1,0.1,0.1]} />
      //               <meshLambertMaterial color={'green'}/> 
      //             </mesh>
      //           </group>
      //         )
      //       } else if (cell === "o") {
      //         return (
      //           <mesh
      //             key={index}
      //             // rotation={[-10,-10,10]}
      //             position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
      //           >
      //             <ringGeometry args={[0.35,0.45,20]} />
      //             <meshLambertMaterial color={'cyan'}/> 
      //           </mesh>
      //         )
      //       } else {
      //         return (
      //           <mesh
      //             key={index}
      //             rotation={[-10,-10,10]}
      //             position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
      //             onClick={(event) => fillSpace(index)}
      //           >
      //             <boxBufferGeometry args={[0.1,0.1,0.1]} />
      //             <meshLambertMaterial color={'white'}/> 
      //           </mesh>
      //         )
      //       }
      //     })
      //   }
      // </group>
      // </Suspense>
    );
  }
  