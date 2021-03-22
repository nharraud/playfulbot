import React from 'react';
import { Sprite } from './Sprite';
import { Order as OrderData } from './types';

interface propsType {
  order: OrderData,
  position?: [number, number, number],
}

const FOOD_TEXTURES = {
  'apple': '/assets/icons/ingredients/apple.png',
  'coconut': '/assets/icons/ingredients/coconut.png',
  'blue_grapes': '/assets/icons/ingredients/blue_grapes.png',
  // 'egg': '/assets/icons/ingredients/egg.png',
  // 'milk': '/assets/icons/ingredients/milk.png',
  'pear': '/assets/icons/ingredients/pear.png',
  'pineapple': '/assets/icons/ingredients/pineapple.png',
  'plums': '/assets/icons/ingredients/plums.png',
  'strawberry': '/assets/icons/ingredients/strawberry.png',

  'cake': '/assets/icons/dishes/cake1.png',
  'cupcake': '/assets/icons/dishes/cupcake.png',
  'yogourt': '/assets/icons/dishes/yogourt.png',
  'jelly': '/assets/icons/dishes/jelly.png',
};

const DISH_COLOR = {
  'cake': 'green',
  'cupcake': 'red',
  'yogourt': 'violet',
  'jelly': 'blue',
};

export default function Order(props: propsType) {
  const ingredients = props.order.ingredients.map((ingredient, index) => (
    <group>
      <Sprite texturePath={'/assets/ui/frame_c3_02.png'} position={[-0.2 + index/1.5,0,1]} ratio={0.004}/>
      <Sprite texturePath={FOOD_TEXTURES[ingredient]} position={[-0.2 + index/1.5,0,2]} ratio={0.002}/>
    </group>
  ));
  return (
    <group position={props.position || [0, 0, 0]}>
      <Sprite texturePath={`/assets/ui/frame_${DISH_COLOR[props.order.dish]}.png`} position={[-1.2,0,1]} ratio={0.002}/>
      {/* <Sprite texturePath={'/assets/ui/frame_s_05.png'} position={[-1.2,0,1]} ratio={0.0034}/> */}
      <Sprite texturePath={FOOD_TEXTURES[props.order.dish]} position={[-1.2,0,2]} ratio={0.002}/>
      <Sprite texturePath={'/assets/ui/breaking_plank_1.png'} position={[0,0,0]} ratio={0.0046}/>
      {ingredients}
  </group>
  );
}