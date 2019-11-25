// eslint-disable-next-line no-unused-vars
import csshook from 'css-modules-require-hook/preset';// 不能使用require，否则不能生效。
import express from 'express';
import compression from 'compression';
import httpProxy from 'http-proxy';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import config from '../../config/config';
import path from 'path';
import fs, { promises as fsp, } from 'fs';
import React from 'react';
import { StaticRouter, Switch, matchPath, } from 'react-router-dom';
import { renderToNodeStream, } from 'react-dom/server';
import { ChunkExtractor, } from '@loadable/server';
import Footer from '../app/components/footer';
import routes, { ssrLoadFns, ssrVerify, } from '../app/containers/routes';
import configureStore from '../app/configureStore';
import { Provider, } from 'react-redux';

const app = express();
const apiUrl = `http://${config.apiHost}:${config.apiPort}`;
const targetUrl = `http://${config.host}:${config.port}`;
const proxy = httpProxy.createProxyServer();
const right_path = path.join(process.cwd());
const store = configureStore();
const statsFile = path.join(right_path, 'dist_server/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile, });
const context = { justStart: true, };

async function attachOuterResource(ws, dir, excludes, attaches) {// 插入除入口js文件和已存在js文件外的所有外部资源，避免客户端二次渲染影响用户体验。
  try {
    let files = await fsp.readdir(dir);
    files = files.filter(file => /^(?!main).+(\.js|\.css)$/.test(file) && !(excludes.find(ex => ex === file)));
    const readPromises = [];
    files.map(file => {
      readPromises.push(new Promise(resolve => {
        if (/\.css$/.test(file)) {
          ws.write(`<link rel="stylesheet" type="text/css" href="/${file}">`);
        } else {
          attaches.str += `<script charset="utf-8" src="/${file}"></script>`;// 不能添加async属性，因为这些脚本是为了用于生成组件，这些组件必须在入口js之前生成供react hydrate执行时使用，否则不能完成客户端注水操作。
        }
        resolve();
      }));
    });
    return Promise.all(readPromises);
  } catch (err) {
    console.error(err);
  }
}
app.get(/\/(?!public).+$/, connectHistoryApiFallback());// 保证刷新页面、通过浏览器地址栏访问时不会绕过history API————即对于通过get请求路由对应的页面时会返回(重定向到/index.htmls)index.html，然后index.html中引入的js执行就会渲染除路由对应的正确页面了。同时要绕过首页路由的history API，因为首页做了首屏服务端渲染优化，如果每个路由的首屏加载都做了服务端渲染，那么要去掉这个中间件了。
app.use((req, res, next) => {
  const { url, } = req;
  const reg = /(\/|\/public)$/;// 暂时只做了首页路由的服务端渲染
  if (reg.test(url)) {
    if (url === '/') {
      return res.redirect('/public');
    }
    const html = fs.readFileSync(path.join(right_path, 'dist/index.html'), 'utf8');
    const htmlGroups = html.match(/([\s\S]+)(<\/head>[\s\S]+"root">)<\/div>([\S\s]+)/);//将读取的html页面分为三部分
    res.write(`${htmlGroups[1]}\r\n`);
    const matchRoute = routes.find(route => matchPath(url, route));
    const attaches = { str: '', };
    const promises = ssrLoadFns[matchRoute.path].map(fn => fn(apiUrl, req.header('cookie'))(store));
    promises.push(ssrVerify(apiUrl, req.header('cookie'))(context));
    promises.push(attachOuterResource(res, path.join(right_path, 'dist'), html.match(/[^/<>"]+\.js/g), attaches));
    Promise.all(promises).then(() => {
      const appStream = renderToNodeStream(
        <Provider store={store}>
          {extractor.collectChunks(
            <>
              <StaticRouter context={context} location={url} >
                <Switch>
                  {routes.map(route => {
                    const { Comp, key, ...rest } = route;
                    return <Comp key={key} {...rest} />;
                  })}
                </Switch>
              </StaticRouter>
              <Footer />
            </>
          )}
        </Provider>
      );
      res.write(`${htmlGroups[2]}`);
      appStream.pipe(res, { end: false, });// 必须设置为false，不然最后一部分流无法写完
      appStream.on('end', () => {
        res.end(`</div><script>window.ssrState=${JSON.stringify(store.getState())}</script>${attaches.str}${htmlGroups[3]}`);
      });
    });
  } else {
    next();
  }
});
app.use(express.static(path.join(right_path, 'dist')), express.static(path.join(right_path, 'static')));
app.use(compression());// 压缩资源
app.use('/api', (req, res) => {
  proxy.web(req, res, {
    target: apiUrl,
  });
});

console.log('Now the process.env.NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  const Webpack = require('webpack');
  const WebpackDevMiddleware = require('webpack-dev-middleware');
  const WebpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../build/webpack.dev');
  const compiler = Webpack(webpackConfig);

  app.use(WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
    writeToDisk: true,
    lazy: false,
  }));
  app.use(WebpackHotMiddleware(compiler, {
    path: '/__hmr',
  }));
}

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`===>open ${targetUrl} in a browser to view the app`);
  }
});