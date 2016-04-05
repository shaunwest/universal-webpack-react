const fs = require('fs');
const React = require('react');
const { Provider } = require('react-redux');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const routes = require('./routes.js');
const postRouter = require('../server/post-router.js'); 

/* eslint-disable no-sync */
const template = fs.readFileSync(__dirname + '/../index.html', 'utf8');
/* eslint-enable no-sync */

const renderTemplateOnly = (req, config, callback) => {
  const url = req.url;
  const { linkcss, nospa } = config;

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    const page = template
      .replace('<!-- CONTENT -->', '')
      .replace('"-- STORES --"', '{}')
      .replace('<!-- STYLESHEET -->', (linkcss) ?
        '<link rel="stylesheet" type="text/css" href="/main.css">' :
        ''
      )
      .replace('<!-- SPA -->', (nospa) ?
        '' :
        '<script src="/bundle.js"></script>'
      );

    callback(null, page);
  });
}

const renderUniversal = (req, config, callback) => {
  const url = req.url;
  const { linkcss, nospa } = config;
  const store = require('./store');

  if (req.method === 'POST') {
    postRouter(store, req);
  }

  const state = store.getState();

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    const rendered = renderToString(
      <Provider store={ store }>
        <RouterContext {...props} />
      </Provider>
    );

    const page = template
      .replace('<!-- CONTENT -->', rendered)
      .replace('"-- STORES --"', JSON.stringify(state))
      .replace('<!-- STYLESHEET -->', (linkcss) ? 
        '<link rel="stylesheet" type="text/css" href="/main.css">' :
        ''
      )
      .replace('<!-- SPA -->', (nospa) ?
        '' :
        '<script src="/bundle.js"></script>'
      );

    callback(null, page);
  });
}

module.exports = { renderUniversal, renderTemplateOnly };
