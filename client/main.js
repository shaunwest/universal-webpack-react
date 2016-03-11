/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from './store';
import routes from './routes';

import styles from './sass/main.scss';

const store = createStore(window.initialStoreData);
const history = syncHistoryWithStore(browserHistory, store);

// For console debugging (?)
window.dev = { store };

ReactDOM.render(
  <Provider store={ store }>
    <Router routes={ routes } history={ history } />
  </Provider>,
  document.getElementById('root')
);
