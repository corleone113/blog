import Express from 'express';
import userService from '../service/user';
import roleService from '../service/role';
import resourceService from '../service/resource';
import tagService from '../service/tag';
import articleService from '../service/article';
import config from '../../config';
import {
    status,
} from '../constants';
// import {
//     status,
// } from '../constants';
import {
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
router.get('/getAllTags', async function (req, res) {
    try {
        const tags = await tagService.findAll(null);
        responseClient(res, 200, 0, '', tags);
    } catch (err) {
        responseClient(res, 200, 1, '获取标签失败', err);
    }
});

//获取文章
router.get('/getArticles', function (req, res) {
    const query = {
        ...req.query,
    };
    query.pageNum = req.query.pageNum || 1;
    query.pageSize = req.query.pageSize || 5;
    query.isPublish = req.query.isPublish !== undefined ? !!req.query.isPublish : true;
    query.tag && (query.tags = query.tag);
    delete query.tag;
    articleService.find(query, r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '', r.data);
            case status.QUERY_ERROR:
                return responseClient(res, 200, 1, '获取文章列表失败!', null);
        }
    }, '_id title isPublish author viewCount commentCount time coverImg content');
});
//获取文章详情
router.get('/getArticleDetail', async (req, res) => {
    const _id = req.query.id;
    try {
        const articleDetail = await articleService.findAll({
            _id,
        });
        articleService.update({
            ids: [_id, ],
            sets: [{
                viewCount: articleDetail[0].viewCount + 1,
            }, ],
        }, r => {
            switch (r.status) {
                case status.SUCCESS:
                    return responseClient(res, 200, 0, '', articleDetail[0]);
                case status.UPDATE_ERROR:
                    throw new Error(r.data);
            }
        });
    } catch (err) {
        console.error(err);
        responseClient(res, 200, 1, '获取文章详情失败', err);
    }
});

export function init() {
    initDB([{
        service: userService,
        initObj: [{
            ...adminUser,
            password: sha2(adminUser.password + SHA2_SUFFIX),
        }, ],
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