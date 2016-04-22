import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../routes.js';
import requestHandler from './request-handler.js'; 
import { populateDatabase, getUser, open, close } from './db.js';

/* eslint-disable no-sync */
const template = fs.readFileSync(__dirname + '/../../index.html', 'utf8');
/* eslint-enable no-sync */

const modes = {
  nothing: { label: 'No SSR/SPA', color: '#FF5733' },
  nossr: { label: 'No SSR', color: '#DAF7A6' },
  nospa: { label: 'No SPA', color: '#FFC300' },
  universal: { label: 'Universal', color: '#58D68D' }
};

const getMode = vars => {
  if (vars.nossr && vars.nospa)
    return 'nothing';
  else if (vars.nossr) 
    return 'nossr';
  else if (vars.nospa)
    return 'nospa';
  else
    return 'universal';
}

const getScriptTag = prod =>
  prod ?
    '<script src="/bundle.js"></script>' :
    '<script src="/bundle.dev.js"></script>';

const getStyleTag = prod =>
  prod ?
    '<link rel="stylesheet" type="text/css" href="/main.css">' :
    '<link rel="stylesheet" type="text/css" href="/main.dev.css">';

const getPage = vars =>
  template
    .replace('<!-- CONTENT -->', vars.rendered)
    .replace('-- MODE_COLOR --', modes[vars.mode].color)
    .replace('<!-- MODE -->', modes[vars.mode].label)
    .replace('"-- STORES --"', JSON.stringify(vars.state))
    .replace('<!-- STYLESHEET -->', (vars.embedcss) ? 
      '' :
      getStyleTag(vars.prod) 
    )
    .replace('<!-- SPA -->', (vars.nospa) ?
      '' :
      getScriptTag(vars.prod)
    );

const renderReactString = (store, props, serverProps) =>
  renderToString(
    <Provider store={ store }>
      <RouterContext 
        {...props} 
        createElement={ (Component, props) => 
          <Component { ...serverProps } { ...props } /> }
      />
    </Provider>
  );

const getServerProps = req =>
  (req.method === 'POST') ?
    { serverPost: req.body } : // what about url parts?
    { 
      serverGet: {
        params: req.params,
        query: req.query
      }
    };

const initialize = cb => {
  open();
  populateDatabase(() => {
    cb();
    close();
  });
}

// This is called on every GET and POST request
const render = (req, res, config, cb) => {
  const url = req.url;

  match({ routes, location: url }, (err, redirect, props) => { 
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      const configureStore = require('../store');
      open();
      getUser('123', (err, user) => {
        const store = configureStore({ user });
        const state = store.getState();
        const serverProps = getServerProps(req);
        const vars = {
          embedcss: config.embedcss,
          nospa: config.nospa,
          nossr: config.nossr,
          state,
          rendered: config.nossr ?
            '' :
            renderReactString(store, props, serverProps),
          mode: getMode(config),
          prod: config.prod
        };
        cb(null, getPage(vars));
        close();
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}

module.exports = { render, initialize };
