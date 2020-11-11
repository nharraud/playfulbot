import React from 'react';
import { useEffect, useRef, useContext, useState } from 'react';

import { Canvas } from 'react-three-fiber';
import { Color } from 'three';
import { a, useSpring } from 'react-spring/three'

import { applyPatch } from 'fast-json-patch';


import { useQuery, useSubscription, gql } from '@apollo/client';
import { getApolloContext } from '@apollo/client/react/context/ApolloContext';

const CUBES_QUERY = gql`
      query GetGame {
        cubes {
          id
          position {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          color
        }
      }
    `;

const MY_DATA_PATCHED = gql`
  subscription onGameChanges {
    gamePatch
  }
  `;


export default function GameCanvas() {
  const { subscribeToMore, loading, error, data } = useQuery(CUBES_QUERY);
  const apolloContext = getApolloContext()
  const aplloContextValue = useContext(getApolloContext())
  // const background = new Color("rgb(0%, 0%, 0%)")
  return (
      <Canvas>
        <color attach="background" args={[0,0,0]} />
        <pointLight position={[10, -10, 10]} />
        <apolloContext.Provider value={aplloContextValue}>
          <GameView/>
        </apolloContext.Provider>
      </Canvas>
  );
}

function GameView() {
  const { subscribeToMore, loading, error, data } = useQuery(CUBES_QUERY);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
        document: MY_DATA_PATCHED,
        // variables: { postID: params.postID },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const patch = subscriptionData.data.gamePatch;
            // console.log(patch)
            // console.log(prev)
            const newDoc = applyPatch(prev, patch, false, false);
            // console.log(newDoc.newDocument);
            return newDoc.newDocument;
        }
    })
    return () => unsubscribe();
  }, [])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    // <div/>
    <group>
    {
      data.cubes.map(({ position, rotation, color, id }) => (
        // <Box position={position} rotation={rotation} id={id} colorName={color}/>
        <BoxMemo position={position} rotation={rotation} id={id} colorName={color}/>
      // <a.mesh
      // key={id}
      //   ref={mesh}
      //   rotation={[-10,-10,rotation.z]}
      //   position={[position.x,position.y,position.z]}
      //   scale={scale}
      // >
      //   <boxBufferGeometry args={[1,1,1]} />
      //   <meshLambertMaterial color={color}/> 
      //   {/* <meshLambertMaterial color='blue'/>  */}
      // </a.mesh>
      ))
    }
    </group>
  );
}

function Box(props) {
  console.log(`render ${props.id}`)
  const [reverse, setReverse] = useState(false)

  const { scale } = useSpring({
    from: {
      scale: [1,1,1],
    },
    to: {
      scale: [2,1,1],
    },
    reverse: reverse,
    onRest: () => {
      console.log("Reverse!!!!!")
      setReverse(!reverse)
    },
  })
  const color = new Color(props.colorName)

  // const mesh = useRef<any>();
  return (
    <a.mesh
    key={props.id}
      // ref={mesh}
      rotation={[-10,-10,props.rotation.z]}
      position={[props.position.x,props.position.y,props.position.z]}
      scale={scale}
    >
      <boxBufferGeometry args={[1,1,1]} />
      <meshLambertMaterial color={color}/> 
      {/* <meshLambertMaterial color='blue'/>  */}
    </a.mesh>
  )
}

const BoxMemo = React.memo(Box);