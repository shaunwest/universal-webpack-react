import { INC } from '../actions/count.js';

const initial = {
  num: 7,
};

const handlers = {
  INC(s) {
    return {
      num: s.num + 1
    };
  }
};

export default function count(state = initial, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state);
  }

  return state;
}
