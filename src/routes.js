import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import store from './store.js';

import App from './components/app.js';
import Home from './components/home';
import Counter from './components/counter';
import Profile from './components/profile';

module.exports = (
  <Provider store={ store }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Home } />
      <Route path="/counter" component={ Counter } />
      <Route path="/profile" component={ Profile } />
    </Route>
  </Provider>
);
