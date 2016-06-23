var webpack = require('webpack');
var path = require('path');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

var ENV = process.env.NODE_ENV || 'development';
var isProd = ENV === 'production';

module.exports = {
  debug: !isProd,
  cache: !isProd,
  target: 'node',
  devtool: isProd ? '#source-map' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, './src'),
  entry: { 'webpackCopyOnDonePlugin': './webpackCopyOnDonePlugin.js' },
  output: {
    library: 'webpack-copy-on-done-plugin',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    unsafeCache: true
  },
  plugins: (function () {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new WebpackErrorNotificationPlugin(/* strategy, options */)
    ];

    if (isProd) {
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          comments: false,
          compressor: {
            warnings: false
          }
        })
      );
    }

    return plugins;
  }())
};
