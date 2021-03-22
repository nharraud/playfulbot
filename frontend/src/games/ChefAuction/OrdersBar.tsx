import React from 'react';
import Order from './Order';
import { Order as OrderData } from './types';

interface propsType {
  orders: OrderData[]
  position?: [number, number, number]
}

export default function OrdersBar(props: propsType) {
  // const ingredients = props.ingredients.map((ingredientName, index) => (
  //   <group>
  //     <Sprite texturePath={'/assets/ui/nailed_plank_dark_brown_3.png'} position={[0,0,0]} ratio={0.008}/>
  //     <Sprite texturePath={'/assets/icons/objects/hourglass.png'} position={[-0.6,0,1]} ratio={0.0035}/>
  //     <Text position={[0,-0.22,1]}>
  //         3
  //     </Text>
  //   </group>
  // ));
  const orders = props.orders.map((order, index) => (
    <Order order={order} position={[-6 + index * 4, -2.5, 0]}/>
  ));
  return (
    <group position={props.position || [0, 0, 0]} >
      {orders}
      {/* <Order order={props.orders[0]} position={[-5.5 * 2, -2.5, 0]}/> */}
    </group>
  );
}