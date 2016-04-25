import express from 'express';
import chokidar from 'chokidar';
import http from 'http';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import colors from 'colors';

// A flag that indicates whether code is executing
// in a server or client context
global.__SERVER__ = true;

// Bug with V8's Object.assign causes SSR to break
// See: https://github.com/facebook/react/issues/6451
Object.assign = null;
Object.assign = require('object-assign');

// This must be a require and it needs to come after
// the Object.assign bug fix (needs further investigation)
const render = require('./src/server/render');

// Assigns all script arguments to an object
// e.g. 'npm start -- arg1' becomes: { arg1: true }
const getArgs = () => process.argv.reduce((result, arg) => {
  result[arg] = true;
  return result;
}, {});

// Runs through node require cache & removes modules
// with paths that contain 'matchString'. Those files will
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
/*const reconfigureForEmbeddedSass = config => {
  config.plugins.pop();
  config.module.loaders[0].loader = undefined;
  config.module.loaders[0].loaders = ['style-loader', 'css-loader', 'sass-loader'];
  return config;
}
*/

// Called on every request. Returns a full page.
const getRenderHandler = config => (req, res, next) => {
  render.render(req, res, config, (err, page) => {
    if (err) return next(err);
    res.send(page);
  });
}

// Initialize express, configure middleware and routes
const createApp = (args, compiler) => {
  // Init Express (for serving content)
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
  app.get('*', getRenderHandler(args));
  app.post('*', getRenderHandler(args));

  return app;
}

// Setup "hot-reloading" of both client and server modules.
// Throws away cached modules and re-requires next time.
const handleModuleReloading = (compiler, cb = () => {}) =>
  compiler.plugin('done', () => {
    console.log('Clearing /src/ module cache from server'.cyan);
    decache('src');
    cb();
  });

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

// Display CLI message that indicates operating mode
const reportArgs = args => {
  const msgs = {
    embedcss: 'Embed CSS enabled',
    nospa: 'SPA disabled',
    nossr: 'Server-side rendering disabled',
    prod: 'Production'
  };

  const lines = Object.keys(args)
    .filter(arg => msgs[arg]) 
    .map(arg => `* ${ msgs[arg] }`);

  if (lines.length)
    console.log(lines.join('\n').magenta + '\n');
}

// Banner
console.log(` UNIVERSAL-WEBPACK-REACT \n`.bgMagenta);

// Get arguments that were passed to this script
const args = getArgs();
reportArgs(args);

// Get the webpack config function
const makeConfig = args.prod ?
  require('./webpack.config.prod.js') :
  require('./webpack.config.js');

// Build the config
const config = makeConfig(args);

// Create a webpack compiler based on the webpack config file
const compiler = webpack(config);

if (args.prod) {
  compiler.run((err, stats) => {
    const app = createApp(args, compiler);
    render.initialize(() => startServer(app));
  });
} else {
  const app = createApp(args, compiler);
  handleModuleReloading(compiler);
  render.initialize(() => startServer(app));
}
