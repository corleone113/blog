const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddHtmlAssets = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    CleanWebpackPlugin,
} = require('clean-webpack-plugin');
const path = require('path');
const chalk = require('chalk');
const handler = (percentage, message, ...args) => {
    // e.g. Output each progress message directly to the console:
    console.info(chalk.green(`${parseInt(percentage*100)}%`), chalk.yellow(message), chalk.blue(...args));
};

const devMode = process.env.NODE_ENV !== 'production';
const rootPath = path.resolve(__dirname, '../');

module.exports = {
    entry: {
        index: [
            '@babel/polyfill',
            path.resolve(rootPath, 'src/app/index.jsx'),
        ],
    },
    output: {
        path: path.resolve(rootPath, 'dist'),
        publicPath: '/',
        filename: '[name]-[hash:9].js',
        chunkFilename: '[name]-[hash:9].js',
    },
    resolve: {
        alias: {
            '@': path.resolve(rootPath, 'src/app'),
            'static': path.resolve(rootPath, 'static'),
        },
        extensions: ['.js', '.jsx', '.css', ],
    },
    devtool: 'cheap-module-eval-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            minChunks: 1,
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    priority: 1,
                    minChunks: 10,
                },
                commons: {
                    name: 'commons',
                    minChunks: 10,
                    priority: -1,
                },
                default: false,
            },
        },
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            // importLoaders: 2,
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true,
                    },
                }, ],
            },
            {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                    },
                }, ],
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(rootPath, 'dll', 'react.manifest.json'),
        }),
        new HtmlWebpackPlugin({
            template: './template/index.html',
            chunks: ['index', 'vendors', 'commons', ],
        }),
        new AddHtmlAssets({
            filepath: path.resolve(rootPath, 'dll', 'react.dll.js'),
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new webpack.ProgressPlugin(handler),
    ],
};