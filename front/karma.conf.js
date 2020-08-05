// This is a karma config file. For more details see
//   http://karma-runner.github.io/2.0/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack
const webpackConfig = require('./build/webpack.test');
// const path = require('path');
// const {
//     getAllTestFiles,
// } = require('./util');

module.exports = function (config) {
    const configuration = {
        // 指定要运行测试的浏览器，可以指定多个。必须要安装对应的加载器(launcher)，karma 会在调起本地的浏览器。
        browsers: ['Firefox', ], // 指定多个浏览器可能导致测试在浏览器启动后阻塞，所以暂时只指定一个，另外Chrome较新版本无法被karma捕获，所以不再考虑使用Chrome作为karma测试浏览器
        customLaunchers: {// travis浏览器启动环境配置
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', ],
            },
        },
        // 指定要使用的测试框架
        frameworks: ['mocha', 'chai', ],
        client: {
            useIframe: false,
        },
        // 这个插件会将每个测试用例的测试结果打印到命令行 console 中。
        reporters: ['spec', 'coverage', ],
        coverageReporter: {
            // specify a common output directory
            dir: './coverage',
            reporters: [
                // 生成 lcov.info 以及 html 文件，lcov.info 该文件中包含了详细的每个文件，每行，每个函数的执行信息。
                {
                    type: 'lcov',
                    subdir: '.',
                },
                // 在命令行输出简要覆盖率数据
                {
                    type: 'text-summary',
                },
            ],
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
            'test/**/*.test.js': ['webpack', 'sourcemap', 'coverage', ],
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
    };
    if (process.env.TRAVIS) {
        // travis环境下使用对应的启动浏览器配置
        configuration.browsers = ['ChromeHeadlessNoSandbox', ];
    }
    config.set(configuration);
};