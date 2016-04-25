import express from 'express';
import http from 'http';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import colors from 'colors';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './src/routes.js';
import { populateDatabase, getUser, open, close } from './src/server/db.js';
import { start } from './index.js';

// A flag that indicates whether code is executing
// in a server or client context
global.__SERVER__ = true;

// Bug with V8's Object.assign causes SSR to break
// See: https://github.com/facebook/react/issues/6451
Object.assign = null;
Object.assign = require('object-assign');

// Assigns all script arguments to an object
// e.g. 'npm start -- arg1' becomes: { arg1: true }
const getArgs = () => process.argv.reduce((result, arg) => {
  result[arg] = true;
  return result;
}, {});

// Initialize express, configure middleware and routes
const createApp = (args, compiler, getPage) => {
  // Init Express
  const app = express();

  // Handle form body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Serve static content (images, etc)
  // Note: static files are server from '/' (not /static)
  app.use(express.static('static'));

  if (!args.prod) {
    // Serve app bundle to client
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true, publicPath: config.output.publicPath
    }));

    // Include hot module-reloading with the app bundle
    app.use(require('webpack-hot-middleware')(compiler));
  }

  // Get server-side-only routes
  app.use((req, res, next) => require('./src/server/app')(req, res, next));

  // All other routes gets passed to the client app's server rendering
  app.get('*', (req, res) => render(req, res, getPage));
  app.post('*', (req, res) => render(req, res, getPage));

  return app;
}

// Listen for connections
const startServer = app => {
  const server = http.createServer(app);

  server.listen(3000, 'localhost', err => {
    if (err) throw err;

    const addr = server.address();

    console.log('Listening at http://%s:%d'.bold.magenta, addr.address, addr.port);
  });

  return server;
}

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

const render = (req, res, getPage) =>
  match({ routes, location: req.url }, (err, redirect, props) => { 
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      const configureStore = require('./src/store');
      open();
      getUser('123', (err, user) => {
        const store = configureStore({ user });
        const state = store.getState();
        const serverProps = getServerProps(req);
        res.send(getPage(state, () => 
          renderReactString(store, props, serverProps)));
        close();
      });
    } else {
      res.status(404).send('Not found');
    }
  });

// Banner
console.log(` BLUESTONE DEMO \n`.black.bgCyan);

// Get arguments that were passed to this script
const args = getArgs();

// Get the webpack config function
const makeConfig = args.prod ?
  require('./webpack.config.prod.js') :
  require('./webpack.config.js');

// Build the config
const config = makeConfig(args);

start(
  config, 
  {
    nospa: args.nospa,
    nossr: args.nossr,
    embedcss: args.embedcss,
    prod: args.prod,
    indexPath: 'index.html',
    debug: true
  },
  (compiler, getPage, report) => {
    console.log(report);
    const app = createApp(args, compiler, getPage);
    initialize(() => startServer(app));
  }
);
