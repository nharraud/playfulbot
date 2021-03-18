import { ReportProblemSharp } from '@material-ui/icons';
import React, { memo, Suspense } from 'react';
import { animated, useSpring, useTransition, config } from 'react-spring/three'
import Text from '../Text';


function Cell(props) {
  const transitions = useTransition(props.cell, null, {
    from: { groupScale: [0,0,0] },
    enter: { groupScale: [1,1,1] },
    leave: { groupScale: [0,0,0] },
    })

  function fillSpace(idx) {
    props.playAction("fillSpace", {space: idx})
  }
  return transitions.map((trans) => {
    if (trans.item === "x") {
      return (
        <animated.group
          rotation={[0,0,Math.PI/4]}
          position={[props.index % 3 - 1.5, Math.ceil(-props.index / 3) + 1,0]}
          scale={trans.props.groupScale}
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
        </animated.group>
      )
    } else if (trans.item === "o") {
      return (
        <animated.mesh
          position={[props.index % 3 - 1.5, Math.ceil(-props.index / 3) + 1,0]}
          scale={trans.props.groupScale}
        >
          <ringGeometry args={[0.35,0.45,20]} />
          <meshLambertMaterial color={'cyan'}/> 
        </animated.mesh>
      )
    } else {
      return (
        <animated.mesh
          position={[props.index % 3 - 1.5, Math.ceil(-props.index / 3) + 1,0]}
          onClick={(event) => fillSpace(props.index)}
          scale={trans.props.groupScale}
        >
          <boxBufferGeometry args={[0.1,0.1,0.1]} />
          <meshLambertMaterial color={'white'}/> 
        </animated.mesh>
      )
    }
  });
}

export default function TicTacToe(props) {

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
            return <Cell key={index} cell={cell} index={index} playAction={props.playAction}/>
          })
        }
      </group>
      </Suspense>
    );
  }
  