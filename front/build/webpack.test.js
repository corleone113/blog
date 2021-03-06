const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');
const AddHtmlAssets = require('add-asset-html-webpack-plugin');

const config = merge(baseConfig, {
    mode: 'development',
    devtool:'eval',
    plugins: [
        new webpack.DefinePlugin({
            'progress.env.BABEL_ENV': JSON.stringify('test'),
        }),
    ],
});

config.plugins = config.plugins.filter(item => !(item instanceof webpack.DllReferencePlugin || item instanceof AddHtmlAssets));// 去掉dll依赖，因为只有在index.html中能访问dll对应的库
module.exports = config;