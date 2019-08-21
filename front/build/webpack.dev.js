const webpack = require('webpack');
const config = require('../config/config');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const OpenPlugin = require('open-browser-webpack-plugin');
module.exports = merge(baseConfig, {
    mode: 'development',
    entry: {
        index: [
            `webpack-hot-middleware/client?path=http://${config.host}:${config.port}/__hmr`,
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenPlugin({
            url: `http://${config.host}:${config.port}`,
        }),
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
});