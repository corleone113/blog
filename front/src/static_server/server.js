import Express from 'express';
import config from '../../config/config';
import path from 'path';

const app = new Express();
const targetUrl = `http://${config.host}:${config.port}`;

app.use('/', Express.static(path.resolve(__dirname, "../..", 'build')));

if (process.env.NODE_ENV !== 'production') {
    const Webpack = require('webpack');
    const WebpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../../webpack.dev');

    const compiler = Webpack(webpackConfig);

    app.use(WebpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        },
        lazy: false
    }));
    app.use(WebpackHotMiddleware(compiler,{
        path:'/__hmr'
    }));
}

app.listen(config.port, (err) => {
    if (err) {
        console.error(err)
    } else {
        console.log(`===>open${targetUrl} in a browser to view the app`);
    }
});