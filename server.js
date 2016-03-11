import express from 'express';
import chokidar from 'chokidar';
import http from 'http';
import webpack from 'webpack';
import config from './webpack.config';

const compiler = webpack(config);
const app = express();

// Serve static content (images, etc)
app.use(express.static('server/static'));

// Serve hot-reloading bundle to client
app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

// Include server routes as a middleware
app.use((req, res, next) => require('./server/app')(req, res, next));

// Anything else gets passed to the client app's server rendering
app.get('*', (req, res, next) => 
  require('./client/server-render')(req.path, req.url, (err, page) => {
    if (err) return next(err);
    res.send(page);
  })
);

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const watcher = chokidar.watch('./server');

watcher.on('ready', () =>
  watcher.on('all', () => {
    // TODO: use 'decache' module?
    console.log("Clearing /server/ module cache from server");
    Object.keys(require.cache).forEach(id => {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
    });
  })
);

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', () => {
  // TODO: use 'decache' module?
  console.log("Clearing /client/ module cache from server");
  Object.keys(require.cache).forEach(function(id) {
    if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
  });
});

// Start listening for connections
const server = http.createServer(app);

server.listen(3000, 'localhost', err => {
  if (err) throw err;

  const addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
