const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'public/components/js');
const APP_DIR = path.resolve(__dirname, 'application');

const config = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: APP_DIR,
      loader: 'babel-loader',
    },
    {
      test: /\.less$/,
      loader: 'style-loader!css-loader?modules!less-loader',
    },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [],
};

module.exports = config;

