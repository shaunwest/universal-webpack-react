const fs = require('fs');
const React = require('react');
const { Provider } = require('react-redux');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const routes = require('./routes.js');
//const postRouter = require('../server/post-router.js'); 
const postRouter = require('./server/post-router.js'); 

/* eslint-disable no-sync */
const template = fs.readFileSync(__dirname + '/../index.html', 'utf8');
/* eslint-enable no-sync */

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

const renderUniversal = (req, config, callback) => {
  const url = req.url;
  const { linkcss, nospa } = config;
  const store = require('./store');
  const state = store.getState();
  const serverProps = (req.method === 'POST') ?
    { serverPost: req.body } :
    { 
      serverGet: {
        params: req.params,
        query: req.query
      }
    };

  match({ routes: routes, location: url }, (err, redirect, props) => { 
    // TODO: redirect and error handling
    const rendered = renderToString(
      <Provider store={ store }>
        <RouterContext 
          {...props} 
          createElement={ (Component, props) => 
            <Component { ...serverProps } { ...props } />
          }
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
