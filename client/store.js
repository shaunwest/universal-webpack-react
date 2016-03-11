const { createStore, combineReducers } = require('redux');
const { routerReducer } = require('react-router-redux');
const reducers = require('./reducers'); // this is only one reducer!

module.exports = function configureStore(initialState) {
  const store = createStore(
    combineReducers({count: reducers, routing: routerReducer}),
    initialState
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
