// import React from "react";
// import { Meta, Story } from "@storybook/react/types-6-0";
// import { GameCanvas, GameCanvasProps } from "./GameCanvas";

// export default {
//   title: "GameCanvas",
//   component: GameCanvas,
// } as Meta;

// // Create a master template for mapping args to render the Button component
// const Template: Story<GameCanvasProps> = (args) => <GameCanvas {...args} />;

// const size = 10;
// // Reuse that template for creating different stories
// export const StartGame = Template.bind({});
// StartGame.args = {
//   gameState: {
//     arena: {
//       size,
//     },
//     players: [{
//       playing: true,
//     }, {
//       playing: true,
//     }],
//     end: false,
//     walls: [
//       [[0, 0], [0, 3], [4, 3], [4, 2]],
//       [[size - 1, size - 1], [size - 1, size - 4], [size - 5, size - 4], [size - 5, size - 3]]
//     ],
//   }
// };
