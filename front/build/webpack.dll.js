const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin, } = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        react: ['react', 'react-dom', ],
    },
    output: {
        path: path.resolve(__dirname, '../dll'),
        filename: '[name].dll.js',
        library: 'react',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: 'react',
            path: path.resolve(__dirname, '../dll', 'react.manifest.json'),
        }),
    ],
};