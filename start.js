// Command-line arguments are specified like this:
// e.g. npm start -- linkcss
//
// Available arguments:
//
// Disable SPA:
// nospa
//
// Do not server-side render:
// nossr 
//
// Link the CSS file externally 
// (rather than embedding it in the js bundle):
// linkcss

require('babel-register')({
  presets: ['es2015', 'stage-0']
});

require('./server.js');
