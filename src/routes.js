import React from 'react';
import { Route, IndexRoute, Router } from 'react-router';
//import { Provider } from 'react-redux';

//import store from './store.js';

import App from './components/app.js';
import Home from './components/home';
import Counter from './components/counter';
import Profile from './components/profile';

// should these routes be moved into their own module?
// otherwise, Provider is getting instantiated twice on server renders
module.exports = (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="/counter" component={ Counter } />
    <Route path="/profile" component={ Profile } />
  </Route>
);
