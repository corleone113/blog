const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    CleanWebpackPlugin,
} = require('clean-webpack-plugin');
const AddHtmlAssets = require('add-asset-html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const path = require('path');
const chalk = require('chalk');
const handler = (percentage, message, ...args) => {
    console.info(chalk.green(`${parseInt(percentage*100)}%`), chalk.yellow(message), chalk.blue(...args));
};
const right_path = process.cwd(); // 不能使用__dirname，因为它在server打包后的文件中是错误的路径。
module.exports = {
    context: right_path,
    entry: {
        main: [
            './src/app/index.jsx',
        ],
    },
    output: {
        path: path.join(right_path, 'dist'),
        publicPath: '/',
        filename: '[name]-[hash:9].js',
        chunkFilename: '[id]-[contenthash:9]-[chunkhash:9].js',
    },
    resolve: {
        alias: {
            '@': path.join(right_path, 'src/app'),
            'static': path.join(right_path, 'static'),
        },
        extensions: ['.js', '.jsx', '.css', ],
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [{
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
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'css-loader', 'postcss-loader', {
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
        new HtmlWebpackPlugin({
            template: './template/index.html',
            chunks: ['main', ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name][hash:9].css',
            chunkFilename: '[id]-[contenthash:9]-[chunkhash:9].css',
            ignoreOrder: true,
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(right_path, 'dll/react.manifest.json'),
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(right_path, 'dll/redux.manifest.json'),
        }),
        new AddHtmlAssets({
            filepath: path.resolve(right_path, 'dll/*.dll.js'),
        }),
        new webpack.ProgressPlugin(handler),
        new LoadablePlugin(),
    ],
};