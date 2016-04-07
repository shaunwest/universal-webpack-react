import express from 'express';
import chokidar from 'chokidar';
import http from 'http';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import colors from 'colors';
import config from './webpack.config';

// Stores all script arguments to an object
// e.g. 'npm start -- arg1' becomes: { arg1: true }
const getArgs = () => process.argv.reduce((result, arg) => {
  result[arg] = true;
  return result;
}, {});

// Runs through node's require cache and clears files
// whose paths contain 'matchString'. Those files will
// be reloaded if they're required again.
const decache = matchString =>
  Object.keys(require.cache)
    .filter(id => new RegExp(`[/\]${ matchString }[/\]`).test(id))
    .map(id => {
      delete require.cache[id];
      return id;
    })
    .forEach(id => console.log(`decaching ${ id }`));

// FIXME: This needs to be way more robust
const reconfigureForEmbeddedSass = config => {
  config.plugins.pop();
  config.module.loaders[0].loader = undefined;
  config.module.loaders[0].loaders = ['style-loader', 'css-loader', 'sass-loader'];
  return config;
}

// Returns a completed page with or without SSR
const getRenderHandler = config => (req, res, next) => {
  const serverRender = require('./client/server-render');
  config.nossr ?
    serverRender.renderTemplateOnly(req, config, (err, page) => {
      if (err) return next(err);
      res.send(page);
    }) :
    serverRender.renderUniversal(req, config, (err, page) => {
      if (err) return next(err);
      res.send(page);
    });
}

// Initialize express, configure middleware and routes
const createApp = (args, compiler) => {
  // Init Express (for serving content)
  const app = express();

  // Handle form body
  app.use(bodyParser.urlencoded({ extended: true }));

  // Serve static content (images, etc)
  app.use(express.static('server/static'));

  // Serve app bundle to client
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: config.output.publicPath
  }));

  // Include hot module-reloading with the app bundle
  app.use(require('webpack-hot-middleware')(compiler));

  // Get server-side-only routes
  app.use((req, res, next) => require('./server/app')(req, res, next));

  // All other routes gets passed to the client app's server rendering
  app.get('*', getRenderHandler(args));
  app.post('*', getRenderHandler(args));

  return app;
}

// Setup "hot-reloading" of both client and server modules.
// Throws away cached modules and re-requires next time.
const handleModuleReloading = (cb = () => {}) => {
  // Do hot-reloading of express server-side modules
  // (Ensure there's no important state in there!)
  const watcher = chokidar.watch(['./server']);
  watcher.on('ready', () =>
    watcher.on('all', () => {
      console.log('Clearing /server/ module cache from server'.cyan);
      decache('server');
      cb();
    })
  );

  // Do client-side hot-reloading
  compiler.plugin('done', () => {
    console.log('Clearing /client/ module cache from server'.cyan);
    decache('client');
    cb();
  });
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

// Display some messaging that indicates what mode
// we're operating in
const reportArgs = args => {
  const msgs = {
    linkcss: 'External CSS enabled',
    nospa: 'SPA disabled',
    nossr: 'Server-side rendering disabled'
  };

  const lines = Object.keys(args)
    .filter(arg => msgs[arg]) 
    .map(arg => `* ${ msgs[arg] }`);

  if (lines.length)
    console.log(lines.join('\n').magenta + '\n');
}

// Banner
console.log(` UNIVERSAL-WEBPACK-REACT \n`.bgMagenta);

// Get arguments passed to this script
const args = getArgs();
reportArgs(args);

// If not linking external css, webpack config needs to be modified
if (!args.linkcss) {
  reconfigureForEmbeddedSass(config);
}

// Create a webpack compiler based on the webpack config file
const compiler = webpack(config);

// Create the app, enable module reloading, and start the server
const app = createApp(args, compiler);
handleModuleReloading();
startServer(app);
