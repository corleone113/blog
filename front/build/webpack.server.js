const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HappyPack = require('happypack');
const baseConfig = require('./webpack.base');
const path = require('path');
const config = merge(baseConfig, {
    target: 'node',
    externals: [nodeExternals(), ],
    entry: {
        main: './src/static_server/server.js',
    },
    output: {
        path: path.join(__dirname, '../dist_server'),
        filename: '[name].js',
        chunkFilename: '[id]-[contenthash:9]-[chunkhash:9].js',
    },
    devtool: false,
});

config.plugins = config.plugins.filter(item => !(item instanceof HappyPack || item instanceof HtmlWebpackPlugin)); // 去掉dll依赖，以为只有在index.html能访问dll对应的库
config.plugins.push(new HappyPack({
    id: 'jsx',
    threads: 4,
    loaders: [{
        loader: 'babel-loader',
        options: {
            plugins: ["react-hot-loader/babel", ["import", {
                    "libraryName": "antd",
                    "style": 'css', // 将样式文件由less改为css
                }, ], "@babel/plugin-proposal-function-bind", ["@babel/plugin-proposal-decorators", {
                    "legacy": true,
                }, ],
                ["@babel/plugin-proposal-class-properties", {
                    "loose": true,
                }, ], "@babel/plugin-transform-runtime", "@babel/plugin-syntax-dynamic-import",
                '@loadable/babel-plugin', // 添加@loadable 服务端渲染babel插件
            ],
        },
    }, ],
}));
module.exports = config;