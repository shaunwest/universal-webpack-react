import { SAVE } from '../actions/user';

const initial = {
  id: '123',
  name: 'bob'
};

export default function user(state = initial, action) {
  switch (action.type) {
    case SAVE:
      return {
        id: action.id,
        name: action.name
      };
    default:
      return state;
  }
};
