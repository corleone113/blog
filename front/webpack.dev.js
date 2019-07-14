const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('./config/config');
const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const OpenPlugin = require('open-browser-webpack-plugin');
console.log('index.html path:', path.resolve(__dirname, 'static', 'index.html'));
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
            // 'react-dom': '@hot-loader/react-dom',
            '@': path.resolve(__dirname, 'src/app/'),
        },
        extensions: ['.js', '.jsx', '.css'],
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
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ["style-loader", 'css-loader', "postcss-loader", {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            }
        ]
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
            // template: path.resolve(__dirname, 'static', 'index.html'),
            template: './template/index.html',
            chunks: ['index', 'vendors', 'commons']
        }),
        new CleanWebpackPlugin(),
    ],
};