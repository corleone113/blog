// This is a karma config file. For more details see
//   http://karma-runner.github.io/2.0/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack
const webpackConfig = require('./build/webpack.test.config');
const path = require('path');
// const {
//     getAllTestFiles,
// } = require('./util');

module.exports = function (config) {
    config.set({
        // 指定要运行测试的浏览器，可以指定多个。必须要安装对应的加载器(launcher)，karma 会在调起本地的浏览器。
        browsers: ['Chrome', ],
        // 指定要使用的测试框架
        frameworks: ['mocha', 'chai', ],
        client: {
            useIframe: false,
        },
        // 这个插件会将每个测试用例的测试结果打印到命令行 console 中。
        reporters: ['spec', 'coverage-istanbul', ],
        coverageIstanbulReporter: {
            // 报告文件形式 参考: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ['html', 'lcovonly', 'text-summary', ],
            // 报告打印位置
            dir: path.join(__dirname, 'coverage'),

            // 跳过未声明的文件
            skipFilesWithNoCoverage: true,
            'report-config': {
              // 配置html报告位置
              html: {
                // outputs the report in ./coverage/html
                subdir: 'html',
              },
            },
        },
        // 希望执行的测试文件, 这里的文件会经过 preprocessor 处理后，通过 script 便签添加到测试页面中。
        // 更多设置可以查看 https://karma-runner.github.io/2.0/config/files.html
        files: [{
            pattern: 'test/**/*.test.js', //不能将这个模式设置为变量，这会导致webpack在karma启动后才build
            watched: false,
            served: true,
            included: true,
        }, ],
        // 使用 webapck 对文件进行编译打包，同时配置 sourcemap 方便调试代码
        preprocessors: {
            'test/**/*.test.js': ['webpack', 'sourcemap', ],
        },
        // wepack 配置项
        webpack: webpackConfig,
        // webpack: {
        //     ...webpackConfig,
        //     entry: () => getAllTestFiles(path.resolve(__dirname, 'test')),
        // },
        webpackMiddleware: {
            noInfo: true,
        },
        // 运行一次后退出，如果设为 true，运行后会默认 watch "files" 中指定的文件，如果有修改会自动重新执行。
        singleRun: true,
        // 监听地址，默认为0.0.0.0
        listenAddress: 'localhost',
        customContextFile: './template/index.html',
        processKillTimeout: 30 * 60 * 1000,
    });
};