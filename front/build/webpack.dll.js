const path = require('path');
const webpack = require('webpack');
const {
    CleanWebpackPlugin,
} = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        react: ['react', 'react-dom', 'react-router-dom', ],
        redux: ['redux', 'react-redux', 'redux-saga', ],
        other: ['remark', 'remark-react', 'axios', 'dateformat', path.resolve(__dirname, '../src/app/configureStore'), ],
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, '../dll', '[name].manifest.json'),
        },),
    ],
};