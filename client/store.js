import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import rootReducer from './reducers/root';
//import { routerReducer } from 'react-router-redux';
//import count from './reducers/count.js';

const configureStore = initialState => {
  const logger = createLogger();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, promise, logger)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    /*module.hot.accept('./reducers/count.js', () => {
      const nextRootReducer = require('./reducers/count.js').default;

      store.replaceReducer(nextRootReducer);
    });*/

    module.hot.accept('./reducers/root.js', () => {
      const nextRootReducer = require('./reducers/root.js').default;

      store.replaceReducer(nextRootReducer);
    });

  }

  return store;
};

const store = configureStore(typeof window !== 'undefined' ? window.initialStoreData : undefined);
module.exports = store;
