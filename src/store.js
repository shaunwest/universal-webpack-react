import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from './reducers/root';

const configureStore = initialState => {
  const logger = createLogger();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, promise, logger)
  );

  if (module.hot) {
    module.hot.accept('./reducers/root.js', () => {
      const nextRootReducer = require('./reducers/root.js').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

module.exports = configureStore;
