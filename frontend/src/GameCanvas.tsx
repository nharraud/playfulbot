import React from 'react';
import { useEffect, useRef, useContext } from 'react';

import { Canvas } from 'react-three-fiber';
import { Color } from 'three';

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
            console.log(patch)
            console.log(prev)
            const newDoc = applyPatch(prev, patch, false, false);
            console.log(newDoc.newDocument);
            return newDoc.newDocument;
        }
    })
    return () => unsubscribe();
  }, [])


  const mesh = useRef<any>();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    const color = new Color("red")
  return (
    // <div/>
    <group>
    {
      data.cubes.map(({ position, rotation, id }) => (
      <mesh
      key={id}
        ref={mesh}
        rotation={[-10,-10,rotation.z]}
        position={[position.x,position.y,position.z]}
      >
        <boxBufferGeometry args={[1,1,1]} />
        <meshLambertMaterial color={color}/> 
        {/* <meshLambertMaterial color='blue'/>  */}
      </mesh>
      ))
    }
    </group>
  );
}