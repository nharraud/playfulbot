import React from 'react';
import useGame from '../useGame';

export default function TicTacToe() {
    const { subscribeToMore, loading, error, data } = useGame();
  
    if (loading || error) return (
      
      <mesh
        rotation={[-10,-10,10]}
        position={[0,0,0]}
      >
        <boxBufferGeometry args={[1,1,1]} />
        <meshLambertMaterial color={'white'}/> 
      </mesh>
    // <p>Loading...</p>;
    )
    console.log(data)
  
    return (
      <group>
        {
          data.game.grid.map((cell, index) => {
            if (cell === "x") {
              return (
                <group
                  key={index}
                  rotation={[0,0,Math.PI/4]}
                  position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
                >
                  <mesh
                    position={[0,0,0]}
                  >
                    <boxBufferGeometry args={[0.1,1,0.1]} />
                    <meshLambertMaterial color={'green'}/> 
                  </mesh>
                  <mesh
                    position={[0,0,0]}
                  >
                    <boxBufferGeometry args={[1,0.1,0.1]} />
                    <meshLambertMaterial color={'green'}/> 
                  </mesh>
                </group>
              )
            } else if (cell === "o") {
              return (
                <mesh
                  key={index}
                  // rotation={[-10,-10,10]}
                  position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
                >
                  <ringGeometry args={[0.35,0.45,20]} />
                  <meshLambertMaterial color={'cyan'}/> 
                </mesh>
              )
            } else {
              return (
                <mesh
                  key={index}
                  rotation={[-10,-10,10]}
                  position={[index % 3 - 1.5, Math.ceil(-index / 3) + 1,0]}
                >
                  <boxBufferGeometry args={[0.1,0.1,0.1]} />
                  <meshLambertMaterial color={'white'}/> 
                </mesh>
              )
            }
          })
        }
      </group>
    );
  }
  