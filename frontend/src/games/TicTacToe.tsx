import React, { Suspense } from 'react';
import Text from '../Text';

export default function TicTacToe(props) {

    function fillSpace(idx) {
      props.playAction("fillSpace", {space: idx})
    }

    const loadingWidget = (
      <mesh
        rotation={[-10,-10,10]}
        position={[0,0,0]}
      >
        <boxBufferGeometry args={[1,1,1]} />
        <meshLambertMaterial color={'white'}/> 
      </mesh>
    );
  
    return (
      <Suspense fallback={loadingWidget}>
      <group>
        <Text position={[-2.3,2,0]}>
          Tic Tac Toe
        </Text>
        {
          props.game.gameState.grid.map((cell, index) => {
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
                  onClick={(event) => fillSpace(index)}
                >
                  <boxBufferGeometry args={[0.1,0.1,0.1]} />
                  <meshLambertMaterial color={'white'}/> 
                </mesh>
              )
            }
          })
        }
      </group>
      </Suspense>
    );
  }
  