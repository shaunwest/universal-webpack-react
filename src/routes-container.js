// TODO: Don't think this is needed
import React from 'react';
import { Route, IndexRoute, Router } from 'react-router';
import { Provider } from 'react-redux';

import store from './store.js';

import routes from './routes.js';

// should these routes be moved into their own module?
// otherwise, Provider is getting instantiated twice on server renders
module.exports = (
  <Provider store={ store }>
    <Router routes={ routes } />
  </Provider>
);
