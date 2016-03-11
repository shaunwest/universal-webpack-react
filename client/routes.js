import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './components/app';
import Home from './components/home';
import Foo from './components/foo';

import createStore from './store';

const store = createStore({});

module.exports = (
  <Provider store={ store }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Home } />
      <Route path="/foo" component={ Foo } />
    </Route>
  </Provider>
);
