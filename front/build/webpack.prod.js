const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    plugins: [
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
});