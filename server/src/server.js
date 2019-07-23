/**
 * api请求server code的含义如下：
 *
 * 0：成功
 * 1：数据不合法
 * 2：客户端数据错误
 * 3：后端错误
 */
import Express from 'express'
import config from './config'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import admin from './controller/admin'
import front, {
    init
} from './controller/public'

const app = new Express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser('express_react_cookie'));
app.use(session({
    secret: 'express_react_cookie',
    resave: true,
    saveUninitialized: true,
    name: 'corleone.sid',
    cookie: {
        maxAge: 60 * 1000 * 30
    } //过期时间
}));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With,some-header');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
//展示页面路由
app.use('/', front);
//管理页面路由
app.use('/admin', admin);

mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/blog`, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log(err, "数据库连接失败");
        return;
    }
    console.log('数据库连接成功了!');
    init();

    app.listen(config.apiPort, function (err) {
        if (err) {
            console.error('err:', err);
        } else {
            console.info(`===> api server is running at ${config.apiHost}:${config.apiPort} when ${new Date().toLocaleString()}`)
        }
    });
});