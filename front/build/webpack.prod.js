const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const AddHtmlAssets = require('add-asset-html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const right_path=process.cwd();
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
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[id].[hash:17].css',
            chunkFilename: '[chunkhash:10][contenthash:10].css',
            ignoreOrder: true,
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(right_path, 'dll/react.manifest.json'),
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(right_path, 'dll/redux.manifest.json'),
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(right_path, 'dll/other.manifest.json'),
        }),
        new AddHtmlAssets({
            filepath: path.resolve(right_path, 'dll/*.dll.js'),
        }),
    ],
});