// Disable SPA:
// nospa
//
// Do not server-side render:
// nossr 
//
// Link the CSS file externally:
// linkcss

import express from 'express';
import chokidar from 'chokidar';
import http from 'http';
import webpack from 'webpack';
import config from './webpack.config';

// Returns true if given argument was given on start
// (e.g. 'npm start -- arg1 arg2')
const isArg = argValue => process.argv.find(arg => arg === argValue);

// Runs through node's require cache and clears files
// whose paths contain 'matchString'
const decache = matchString =>
  Object.keys(require.cache)
    .filter(id => new RegExp(`[/\]${ matchString }[/\]`).test(id))
    .map(id => {
      delete require.cache[id];
      return id;
    })
    .forEach(id => console.log(`decaching ${ id }`));

// Returns a completed page with or without SSR
const render = (nossr, nospa, linkcss) => (req, res, next) => {
  const serverRender = require('./client/server-render');
  nossr ?
    serverRender.renderTemplateOnly(req, linkcss, nospa, (err, page) => {
      if (err) return next(err);
      res.send(page);
    }) :
    serverRender.renderUniversal(req, linkcss, nospa, (err, page) => {
      if (err) return next(err);
      res.send(page);
    });
};

// Get a webpack compiler from the webpack config file
const compiler = webpack(config);

// Init Express (for serving content)
const app = express();

// Serve static content (images, etc)
app.use(express.static('server/static'));

// Serve hot-reloading bundle to client
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

// Get server-side only routes
app.use((req, res, next) => require('./server/app')(req, res, next));

// All other routes gets passed to the client app's server rendering
app.get('*', render(isArg('nossr'), isArg('nospa'), isArg('linkcss')));
app.post('*', render(isArg('nossr'), isArg('nospa'), isArg('linkcss')));

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const watcher = chokidar.watch(['./server']);
watcher.on('ready', () =>
  watcher.on('all', () => {
    console.log('Clearing /server/ module cache from server');
    decache('server');
  })
);

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', () => {
  console.log('Clearing /client/ module cache from server');
  decache('client');
});

// Start listening for connections
const server = http.createServer(app);

server.listen(3000, 'localhost', err => {
  if (err) throw err;

  const addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
