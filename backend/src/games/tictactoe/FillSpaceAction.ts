import { GameAction } from '~playfulbot/types/action';

export default interface FillSpaceAction extends GameAction {
  name: 'fillSpace';
  data: {
    space: number;
  };
}
