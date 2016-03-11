const fs = require('fs');
const React = require('react');
const { Provider } = require('react-redux');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const routes = require('./routes.js');

/* eslint-disable no-sync */
const template = fs.readFileSync(__dirname + '/../index.html', 'utf8');
/* eslint-enable no-sync */

const renderApp = (path, url, callback) => {
  const store = require('./store')();
  const state = store.getState();

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    const rendered = renderToString(
      <Provider store={ store }>
        <RouterContext {...props} />
      </Provider>
    );

    const page = template
      .replace('<!-- CONTENT -->', rendered)
      .replace('"-- STORES --"', JSON.stringify(state));

    callback(null, page);
  });
}

module.exports = renderApp;
