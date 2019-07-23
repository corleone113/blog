import Express from 'express'
import Tags from '../models/tags'
import Article from '../models/article'
import UserService from '../service/user';
import RoleService from '../service/role';
import ResourceService from '../service/resource';
import config from '../config'
import {
    status
} from '../constants'
import {
    responseClient,
    initDB
} from '../util'

const router = Express.Router();

const {
    adminUser,
    initRoles,
    resources
} = config;

// router.use('/user', require('./user'));
//获取全部标签
router.get('/getAllTags', function (req, res) {
    Tags.find(null, 'name').then(data => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        })
        responseClient(res, 200, 0, '请求成功', data);
    }).catch(err => {
        responseClient(res);
    })
});

//获取文章
router.get('/getArticles', function (req, res) {
    let tag = req.query.tag || null;
    let isPublish = req.query.isPublish;
    let searchCondition = {
        isPublish,
    };
    if (tag) {
        searchCondition.tags = tag;
    }
    if (isPublish === 'false') {
        searchCondition = null
    }
    let skip = (req.query.pageNum - 1) < 0 ? 0 : (req.query.pageNum - 1) * 5;
    let responseData = {
        total: 0,
        list: []
    };
    Article.countDocuments(searchCondition)
        .then(count => {
            responseData.total = count;
            Article.find(searchCondition, '_id title isPublish author viewCount commentCount time coverImg', {
                    skip: skip,
                    limit: 5
                })
                .then(result => {
                    responseData.list = result;
                    responseClient(res, 200, 0, 'success', responseData);
                }).cancel(err => {
                    throw err
                })
        }).cancel(err => {
            responseClient(res);
        });
});
//获取文章详情
router.get('/getArticleDetail', (req, res) => {
    let _id = req.query.id;
    Article.findOne({
            _id
        })
        .then(data => {
            data.viewCount = data.viewCount + 1;
            Article.updateOne({
                    _id
                }, {
                    viewCount: data.viewCount
                })
                .then(result => {
                    responseClient(res, 200, 0, 'success', data);
                }).cancel(err => {
                    throw err;
                })

        }).cancel(err => {
            responseClient(res);
        });
});

export function init() {
    initDB([{
        Service: UserService,
        initObj: [adminUser],
        queryKey: 'username',
        successMsg: '初始化管理员账户成功!'
    }, {
        Service: RoleService,
        initObj: initRoles,
        queryKey: 'name',
        successMsg: '初始化角色成功!'
    }, {
        Service: ResourceService,
        initObj: resources,
        queryKey: 'name',
        successMsg: '初始化资源成功!',
        handleObj: (objs, saveObjs) => {
            const ids = [],
                sets = [];
            for (let i = 0; i < objs.length; ++i) {
                const obj = objs[i]
                if (obj.parent) {
                    ids.push(obj._id);
                    sets.push({
                        parent_id: saveObjs.get(obj.parent)._id
                    })
                }
            }
            new ResourceService(null, {
                ids,
                sets
            }).update(r => {
                switch (r.status) {
                    case status.SUCCESS:
                        return console.log('建立资源联系成功!');
                    case status.UPDATE_ERROR:
                        return console.log('建立资源联系失败!');
                }
            })
        }
    }]);
}

export default router;