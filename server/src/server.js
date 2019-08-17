/**
 * api请求server code的含义如下：
 *
 * 0：成功
 * 1：数据不合法
 * 2：客户端数据错误
 * 3：后端错误
 */
import Express from 'express';
import fs from 'fs';
import path from 'path';
import config from '../config';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import admin from './controller/admin';
import front, {
    init,
} from './controller/public';
import {
    responseClient,
    verifyToken,
} from './util';

const app = new Express();
const configPath = path.resolve(__dirname, '../config/index.js');

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());
app.use(cookieParser('express_react_cookie'));
app.use(session({
    secret: 'express_react_cookie',
    resave: true,
    saveUninitialized: true,
    name: 'corleone.sid',
    cookie: {
        maxAge: 60 * 1000 * 30,
        // maxAge: 20 * 1000,
    }, //过期时间
}));
app.all('/admin/manage/*', async (req, res, next) => {
    try {
        if (!req.session.token) {
            console.log('过期会话:', req.session);
            return responseClient(res, 203, 2, '会话已过期，请重新登录', null);
        }
        const data = fs.readFileSync(configPath);
        const secret = data.toString().match(/jwtSecret:'([\S\s]*)',/)[1];
        await verifyToken(req.session.token, secret);
        // console.log('The user:', user);
        next();
    } catch (err) {
        console.log('the error:', err);
        responseClient(res, 200, 1, '验证失败', err);
    }
});
//展示页面路由
app.use('/', front);
//管理页面路由
app.use('/admin', admin);

mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/blog`, {
    useNewUrlParser: true,
}, function (err) {
    if (err) {
        console.log(err, '数据库连接失败');
        return;
    }
    console.log('数据库连接成功了!');
    init();

    app.listen(config.apiPort, function (err) {
        if (err) {
            console.error('err:', err);
        } else {
            console.info(`===> api server is running at http://${config.apiHost}:${config.apiPort}/ when ${new Date().toLocaleString()}`);
        }
    });
});