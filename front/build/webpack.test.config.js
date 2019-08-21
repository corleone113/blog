const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');
const config = merge(baseConfig, {
    mode: 'none',
    devtool: '#inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('test'),
        }),
    ],
});
config.plugins = config.plugins.filter(item => !(item instanceof webpack.ProgressPlugin || item instanceof webpack.DllReferencePlugin));
// config.plugins = config.plugins.filter(item => !(item instanceof webpack.ProgressPlugin ));
module.exports = config;