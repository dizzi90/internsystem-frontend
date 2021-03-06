var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  debug: true,
  devtool: 'eval',

  stats: {
    colors: true,
    reasons: true
  },

  entry: {
    'app': [
      'webpack/hot/only-dev-server',
      './src/app.js',
    ],
  },
  output: {
    path: __dirname + '/build/',
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?stage=0']},
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.scss$/, loader: 'style!css!sass'},
      {test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'},
      {test: /\.json$/, loader: 'json'},
    ]
  },
  externals: {
    mathjs: 'mathjs',
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      DEBUG: true,
      BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || '/'), // if using webpack-dev-server, it will use port 8000 of same hostname, see api.js
    }),
  ]
};
