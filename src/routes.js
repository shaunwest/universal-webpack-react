import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home';
import Counter from './components/counter';
import Profile from './components/profile';

module.exports = (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="/counter" component={ Counter } />
    <Route path="/profile" component={ Profile } />
  </Route>
);
