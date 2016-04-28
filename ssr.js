import fs from 'fs';
import webpack from 'webpack';

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

// Runs through node require cache & removes modules
// with paths that contain 'matchString'. Those files will
// be reloaded if they're required again.
const decache = (matchString, debug) =>
  Object.keys(require.cache)
    .filter(id => new RegExp(`[/\]${ matchString }[/\]`).test(id))
    .map(id => {
      delete require.cache[id];
      return id;
    })
    .forEach(id => debug && console.log(`decaching ${ id }`));

// Setup "hot-reloading" of both client and server modules.
// Throws away cached modules and re-requires next time.
const handleModuleReloading = (compiler, debug = false) =>
  compiler.plugin('done', () => {
    if (debug) console.log('Clearing /src/ module cache from server'.cyan);
    decache('src', debug);
  });

// TODO: read bundle name from webpack config
const getScriptTag = prod =>
  prod ?
    '<script src="/bundle.js"></script>' :
    '<script src="/bundle.dev.js"></script>';

// TODO: read style name from webpack config
const getStyleTag = prod =>
  prod ?
    '<link rel="stylesheet" type="text/css" href="/main.css">' :
    '<link rel="stylesheet" type="text/css" href="/main.dev.css">';

// Display CLI message that indicates operating mode
const getReport = props => {
  const msgs = {
    embedcss: 'Embed CSS enabled',
    nospa: 'SPA disabled',
    nossr: 'Server-side rendering disabled',
    prod: 'Production',
    debug: 'Debug Mode'
  };

  const lines = Object.keys(props)
    .filter(prop => props[prop] && msgs[prop]) 
    .map(prop => `${ msgs[prop] }`);

  return lines.length ?
    lines.join('\n') : '';
}

const createPageRender = props => {
  /* eslint-disable no-sync */
  const template = fs.readFileSync(__dirname + '/' + props.indexPath, 'utf8');
  /* eslint-enable no-sync */

  const mode = getMode(props);

  return (state, renderCb) =>
    template
      .replace('<!-- CONTENT -->', props.nossr || !renderCb ? '' : renderCb(props))
      .replace('"-- MODE_COLOR --"', modes[mode].color)
      .replace('<!-- MODE -->', modes[mode].label)
      .replace('"-- STORES --"', state ? JSON.stringify(state) : '')
      .replace('<!-- STYLESHEET -->', (props.embedcss) ? 
        '' :
        getStyleTag(props.prod) 
      )
      .replace('<!-- SPA -->', (props.nospa) ?
        '' :
        getScriptTag(props.prod)
      );
}

const start = (webpackConfig, props, cb) => {
  const compiler = webpack(webpackConfig);

  if (props.prod) {
    compiler.run((err, stats) => {
      cb(compiler, createPageRender(props), getReport(props));
    });
  } else {
    handleModuleReloading(compiler, props.debug);
    cb(compiler, createPageRender(props), getReport(props)); 
  }
}

module.exports = { start };
