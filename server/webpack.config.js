const path = require('path')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: [
        './test_server/server.js',
        './test_server/front.js',
    ],
    // entry: {
    //     1: './test/2.js'
    // },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    node:{
        process:false
    },
    // optimization: {
    //     usedExports: true,
    //     splitChunks: {
    //         chunks: 'all',
    //         minSize: 0,
    //         minChunks: 1,
    //         cacheGroups: {
    //             vendors: {
    //                 name:'vendors',
    //                 // test: /(react|jquery)/,
    //                 test:/node_modules/,
    //                 minChunks: 1,
    //                 priority: 1
    //             },
    //             // commons: {
    //             //     name:'commons',
    //             //     minChunks: 1,
    //             //     priority: -1
    //             // },
    //             // usedM:{
    //             //     name:'usedM',
    //             //     minChunks:1,
    //             //     priority:2,
    //             //     test:/(lodash|moment)/
    //             // },
    //             default: false
    //         }
    //     }
    // },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}