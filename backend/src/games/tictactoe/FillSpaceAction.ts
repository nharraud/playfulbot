import { Action } from '~playfulbot/types/action';

export default interface FillSpaceAction extends Action {
  name: 'fillSpace';
  data: {
    space: number;
  };
}
