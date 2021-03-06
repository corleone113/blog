import express from 'express';
import {
    responseClient,
    verifyToken,
} from '../../util';
import userService from '../../service/user';
import roleService from '../../service/role';
import resourceService from '../../service/resource';
import tagService from '../../service/tag';
import articleService from '../../service/article';

import {
    status,
} from '../../constants';

const services = {
    user: userService,
    role: roleService,
    resource: resourceService,
    tag: tagService,
    article: articleService,
};
const router = express.Router();
router.all('/*', async (req, res, next) => {
    try {
        if (!req.session.token) {
            return responseClient(res, 203, 2, '会话已过期，请重新登录', null);
        }
        const {
            token,
            secret,
        } = req.session;
        const result = await verifyToken(token, secret);
        if (!result) {
            return responseClient(res, 203, 2, '令牌不正确!', null);
        }
        if (req.url === '/verify') { // 完整的路径其实是/admin/manage/verify,但这是一个子路由监听器，所以路径也是子路径，即 /verify。
            return responseClient(res, 200, 0, '', result);
        }
        if (req.url === '/verify/1') {
            delete req.session.token;
            return responseClient(res, 200, 0, '', null);
        }
        next();
    } catch (err) {
        console.log('the error:', err);
        responseClient(res, 200, 1, '验证失败', err);
    }
});
router.use('/:type/:id?', (req, res, next) => {
    if (!services.hasOwnProperty(req.params.type)) {
        return responseClient(res, 500, 1, '方法错误', null);
    }
    next();
});
router.get('/:type', async (req, res) => {
    const {
        query,
        params,
    } = req;
    if (query.username) {
        query.username = JSON.parse(query.username);
    }
    if (query.name) {
        query.name = JSON.parse(decodeURI(query.name));
    }
    if (query.pageSize === 'n') {
        delete query.pageNum;
        delete query.pageSize;
        delete query.order;
        let list = await services[params.type].findAll(query);
        if (list) {
            if (params.type === 'resource') {
                list = resourceService.getTrees(list);
            }
            responseClient(res, 200, 0, '', {
                list,
            });
        } else {
            responseClient(res, 200, 1, '查询出错!', null);
        }
    } else {
        services[params.type].find(query, r => {
            switch (r.status) {
                case status.SUCCESS:
                    return responseClient(res, 200, 0, '', r.data);
                case status.QUERY_ERROR:
                    return responseClient(res, 200, 1, '查询出错!', null);
            }
        });
    }
});
router.post('/:type', (req, res) => {
    const {
        params,
        body: model,
    } = req;
    services[params.type].create(model, model, result => {
        switch (result.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '添加成功!', null);
            case status.EXISTED:
                return responseClient(res, 200, 1, '添加失败!不能添加重复的记录', null);
            case status.QUERY_ERROR:
                return responseClient(res);
        }
    });
});
router.put('/:type', (req, res) => {
    const {
        body: {
            ids,
            sets,
        },
        params,
    } = req;
    services[params.type].update({
        ids,
        sets,
    }, r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '修改成功!', null);
            case status.UPDATE_ERROR:
                return responseClient(res, 203, 1, '修改出错!', null);
        }
    });
});
router.delete('/:type/:id?', (req, res) => {
    const {
        id,
        type,
    } = req.params;
    const {
        ids,
    } = req.body;
    let dids = [];
    id ? dids.push(id) : '';
    dids = ids ? dids.concat(ids) : dids;
    services[type].delete({
        ids: dids,
    }, r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '删除成功!', null);
            case status.UPDATE_ERROR:
                return responseClient(res, 203, 1, '删除出错!', null);
        }
    });
});
export default router;