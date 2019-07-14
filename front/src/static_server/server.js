import express from 'express';
import compression from 'compression';
import httpProxy from 'http-proxy';
import connectHistoryApiFallback from 'connect-history-api-fallback'
import config from '../../config/config';
import path from 'path';

const app = express();
const apiUrl = `http://${config.apiHost}:${config.apiPort}`;
const targetUrl = `http://${config.host}:${config.port}`;
const proxy = httpProxy.createProxyServer();

app.use('/', connectHistoryApiFallback());
app.use(compression());
app.use('/', express.static(path.resolve(__dirname, "../..", 'build')));
app.use('/', express.static(path.join(__dirname, "../..", 'static')));
app.use('/api', (req, res) => {
    proxy.web(req, res, {
        target: apiUrl
    });
})

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
    app.use(WebpackHotMiddleware(compiler, {
        path: '/__hmr'
    }));
}

app.listen(config.port, (err) => {
    if (err) {
        console.error(err)
    } else {
        console.log(`===>open${targetUrl} in a browser to view the app`);
    }
});