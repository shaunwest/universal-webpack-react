// Command-line arguments are specified like this:
// npm start -- linkcss
//
// Available arguments:
//
// nospa    Disable SPA
// nossr    Disable server-side rendering
// linkcss  Link the CSS file externally (rather than embedding it in the js bundle)
//
// Proposed:
// prod     Not sure if this is the right approach...

// Add import/export and proposed ES7 functionality to node
require('babel-register')({
  presets: ['es2015', 'stage-0']
});

// We need to require our server code for the babel
// transforms to be applied
// (rather than just embedding it in this file)
require('./server.js');
