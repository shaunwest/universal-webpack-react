var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || "production";

module.exports = function () {
  return {
    devtool: false,
    entry: [
      './src/main.js'
    ],
    output: {
      path: __dirname + '/static',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({ __SERVER__: false }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('main.css'),
      new webpack.optimize.DedupePlugin()
    ],
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
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
          include: path.join(__dirname, 'src', 'sass')
        },
        {
          test: /\.js$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel?cacheDirectory&presets[]=es2015&presets[]=react&presets[]=stage-0'
        }
      ]
    }
  };
}
