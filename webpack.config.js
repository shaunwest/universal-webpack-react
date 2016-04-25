var path = require('path');
var qs = require('querystring');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || "development";

function configPlugins(embedcss) {
  var plugins = [
    new webpack.DefinePlugin({ __SERVER__: false }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];
  
  if (!embedcss) {
    plugins.push(new ExtractTextPlugin('main.dev.css'));
  }

  return plugins;
}

module.exports = function (args) {
  return {
    devtool: '#cheap-module-source-map',
    entry: [
      'webpack-hot-middleware/client',
      './src/main.js'
    ],
    output: {
      path: __dirname,
      filename: 'bundle.dev.js',
      publicPath: '/'
    },
    plugins: configPlugins(args.embedcss),
    resolve: {
      extensions: ['', '.js'],
      alias: {
        request: 'browser-request'
      }
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: (args.embedcss) ? undefined : ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
          loaders: (args.embedcss) ? ['style-loader', 'css-loader', 'sass-loader'] : undefined,
          include: path.join(__dirname, 'src', 'sass')
        },
        {
          test: /\.js$/,
          loader: 'babel',
          include: path.join(__dirname, 'src'),
          query: {
            "env": {
              "development": {
                "presets": ["react-hmre", "stage-0"],
                "plugins": [
                  ["react-transform", {
                    "transforms": [{
                      "transform": "react-transform-hmr",
                      "imports": ["react"],
                      "locals": ["module"]
                    }]
                  }]
                ]
              }
            }
          }
        }
      ]
    }
  };
}
