import { INC } from '../actions/count.js';

const initial = {
  num: 7
};

export default function count(state = initial, action) {
  switch(action.type) {
    case INC:
      return {
        num: state.num + 1
      };
    default:
      return state;
  }
}
