const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
//const { merge } = require('webpack-merge');
//const common = require('./webpack.common');

module.exports = {
  entry: {
    trips: './src/client/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'img/[name][ext]',
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
   
    contentBase: path.resolve(__dirname, './src/client'),
    hot: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/transform-runtime'],
          },
        },
      },
      {
        test: /\.(png|jpg)$/i,
        type: 'asset/resource',
        generator: {
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      verbose: true,
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      template: './src/client/views/index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['trips'],
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]
}


