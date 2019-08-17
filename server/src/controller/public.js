import Express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Route, Switch, } from 'react-router';
import Tags from '../models/tags';
import Article from '../models/article';
import userService from '../service/user';
import roleService from '../service/role';
import resourceService from '../service/resource';
import config from '../../config';
// import {
//     status,
// } from '../constants';
import  {
    responseClient,
    initDB,
    SHA2_SUFFIX,
    sha2,
} from '../util';

const router = Express.Router();

const {
    adminUser,
    initRoles,
    resources,
} = config;

// router.use('/user', require('./user'));
//获取全部标签
router.get('/getAllTags', function (req, res) {
    Tags.find(null, 'name').then(data => {
        responseClient(res, 200, 0, '请求成功', data);
    }).catch(err => {
        responseClient(res, 203, 1, err);
    });
});

router.get('/hehe/*', (req, res) => {
    console.log('the query:', req.query);
    const context = {};
    context.url = req.url;
    const list = ReactDOMServer.renderToString(
        <StaticRouter context={context}
            location={req.url}>
            <Switch>
                <Route path="/hehe/1" render={(props) => {
                    return (<ul>
                        <li>one</li>
                        <li>two</li>
                        <li>three</li>
                        <li>This is P tag and context:{JSON.stringify(props)}</li>
                    </ul>);
                }} />
                <Route path="/hehe/2" render={(props) => {
                    return <p>This is P tag and context:{JSON.stringify(props)}</p>;
                }} />
                <Route render={(props) => {
                    context.code = 404;
                    return <p>404{JSON.stringify(props.staticContext)}</p>;
                }} />
            </Switch>

        </StaticRouter>
    );
    console.log('now the context:', context);
    res.set({
        'Content-Type': 'text/html',
    });
    context.code ? responseClient(res, 404, 1, '>>>>', list) : responseClient(res, 200, 0, '>>>>', list);
});


//获取文章
router.get('/getArticles', function (req, res) {
    const tag = req.query.tag || null;
    const {
        isPublish,
    } = req.query;
    let searchCondition = {
        isPublish,
    };
    if (tag) {
        searchCondition.tags = tag;
    }
    if (isPublish === 'false') {
        searchCondition = null;
    }
    const skip = (req.query.pageNum - 1) < 0 ? 0 : (req.query.pageNum - 1) * 5;
    const responseData = {
        total: 0,
        list: [],
    };
    Article.countDocuments(searchCondition)
        .then(count => {
            responseData.total = count;
            Article.find(searchCondition, '_id title isPublish author viewCount commentCount time coverImg content', {
                skip: skip,
                limit: 5,
            })
                .then(result => {
                    responseData.list = result;
                    responseClient(res, 200, 0, 'success', responseData);
                }).cancel(err => {
                    throw err;
                });
        }).cancel(err => {
            responseClient(res, 203, 1, err);
        });
});
//获取文章详情
router.get('/getArticleDetail', (req, res) => {
    const _id = req.query.id;
    Article.findOne({
        _id,
    }).then(data => {
        data.viewCount = data.viewCount + 1;
        Article.updateOne({
            _id,
        }, {
                viewCount: data.viewCount,
            })
            .then(() => {
                responseClient(res, 200, 0, 'success', data);
            }).cancel(err => {
                throw err;
            });

    }).cancel(() => {
        responseClient(res);
    });
});

export function init() {
    initDB([{
        service: userService,
        initObj: [{ ...adminUser, password:sha2(adminUser.password+SHA2_SUFFIX), }, ],
        queryKey: 'username',
        successMsg: '初始化管理员账户成功!',
    }, {
        service: roleService,
        initObj: initRoles,
        queryKey: 'name',
        successMsg: '初始化角色成功!',
    }, {
        service: resourceService,
        initObj: resources,
        queryKey: 'name',
        successMsg: '初始化资源成功!',
    }, ]);
}

export default router;