const initial = {
  name: 'bob',
};

const handlers = {
  SAVE(s, action) {
    return {
      name: action.name
    };
  }
};

export default function user(state = initial, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }

  return state;
};
