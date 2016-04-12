import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes.js';
import requestHandler from './server/request-handler.js'; 
import { getUser } from './server/db.js';

// TODO: shouldn't this be in the server/ folder?

/* eslint-disable no-sync */
const template = fs.readFileSync(__dirname + '/../index.html', 'utf8');
/* eslint-enable no-sync */

// TODO: Maybe just combine these render methods into one

// This is called on every GET and POST request
const renderTemplateOnly = (req, config, callback) => {
  const url = req.url;
  const { linkcss, nospa } = config;

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    const page = template
      .replace('<!-- CONTENT -->', '')
      .replace('"-- STORES --"', '{}')
      .replace('-- MODE_COLOR --', (nospa) ? '#FF5733' : '#DAF7A6')
      .replace('<!-- MODE -->', (nospa) ? 'No SSR/SPA' : 'No SSR')
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

  // populate store from db
  //const getUser = require('./server/db.js');
  //getUser('123', (err, user) => );

// This is called on every GET and POST request
const renderUniversal = (req, res, config, callback) => {
  const url = req.url;
  const { linkcss, nospa } = config;
  const store = require('./store');
  const state = store.getState();
  const serverProps = (req.method === 'POST') ?
    { serverPost: req.body } : // what about url parts?
    { 
      serverGet: {
        params: req.params,
        query: req.query
      }
    };

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    // TODO: get database asynchronously
    // TODO: redirect and error handling
    const rendered = renderToString(
      <Provider store={ store }>
        <RouterContext 
          {...props} 
          createElement={ (Component, props) => 
            <Component { ...serverProps } { ...props } /> }
        />
      </Provider>
    );

    const page = template
      .replace('<!-- CONTENT -->', rendered)
      .replace('-- MODE_COLOR --', (nospa) ? '#FFC300' : '#58D68D')
      .replace('<!-- MODE -->', (nospa) ? 'No SPA' : 'Universal')
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
