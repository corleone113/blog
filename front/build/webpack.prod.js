const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        filename: '[id].[hash:17].js',
        chunkFilename: '[chunkhash:10][contenthash:10].js',
    },
    devtool: false,
    optimization: {
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
        }), new OptimizeCssPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true,
                    },
                }, ],
            },
        }), ],
        splitChunks: {
            chunks: 'all',
            maxSize: 550000,
            minChunks: 2,
            minSize: 100000,
        },
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
        new MiniCssExtractPlugin({
            filename: '[id].[hash:17].css',
            chunkFilename: '[chunkhash:10][contenthash:10].css',
            ignoreOrder: true,
        }),
    ],
});