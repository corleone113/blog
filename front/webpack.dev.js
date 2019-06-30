const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('./config/config');
const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const OpenPlugin = require('open-browser-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        index: [
            `webpack-hot-middleware/client?path=http://${config.host}:${config.port}/__hmr`,
            '@babel/polyfill',
            path.resolve(__dirname, 'src/app', 'index.jsx')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name]-[hash:9].js'
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            minChunks: 1,
            cacheGroups: {
                venders: {
                    name: 'vendors',
                    test: /node_modules/,
                    minChunks: 1,
                    priority: 1
                },
                commons: {
                    name: 'commons',
                    minChunks: 1,
                    priority: -1
                },
                default: false
            }
        }
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new OpenPlugin({
            url: `http://${config.host}:${config.port}`
        }),
        new webpack.DefinePlugin({
            "progress.env.NODE_ENV": JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            chunks: ['index', 'vendors', 'commons']
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts']
    }
};