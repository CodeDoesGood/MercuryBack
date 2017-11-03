const DashboardPlugin = require('webpack-dashboard/plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/components/js/');
const APP_DIR = path.resolve(__dirname, 'application/');

const config = {
  devtool: 'eval',
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    publicPath: 'components/js/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
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
  plugins: [
    new DashboardPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [],
};

module.exports = config;
