import { SYNCING_REMOTE } from '../actions/sync.js';

const initial = {
  syncingRemote: false
};

export default function sync(state = initial, action) {
  switch (action.type) {
    case SYNCING_REMOTE:
      const sync = Object.assign({}, state.sync, { syncingRemote: true });
      return Object.assign({}, state, { sync });
    default:
      return state;
  }
}
