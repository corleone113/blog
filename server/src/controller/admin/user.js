import express from 'express';
import {
    responseClient
} from '../../util';
import UserService from '../../service/user';
import {
    status
} from '../../constants';
const router = express.Router();
router.get('/', (req, res) => {
    const query = req.query;
    if (query.order) {
        const arr = query.order.split(',');
        const obj = {};
        for (let i = 0; i < arr.length; i += 2) {
            obj[arr[i]] = parseInt(arr[i + 1]);
        }
        query.order = obj;
    }
    new UserService(null,query).find(r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '', r.data);
            case status.QUERY_ERROR:
                return responseClient(res, 203, 1, '查询出错!', null);
        }
    });
})
router.put('/', (req, res) => {
    const {
        ids,
        sets
    } = req.body;
    // console.log('the query:', req.query);
    new UserService(null,{
        ids,
        sets
    }).update(r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '修改成功!', r.data);
            case status.UPDATE_ERROR:
                return responseClient(res, 203, 1, '修改出错!', null);
        }
    })
})
router.delete('/:id?', (req, res) => {
    const {
        id
    } = req.params;
    let {
        ids
    } = req.body;
    let dids = [];
    id ? dids.push(id) : '';
    dids = ids ? dids.concat(ids) : dids;
    new UserService(null,{
        ids:dids
    }).delete(r => {
        switch (r.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '删除成功!', r.data);
            case status.UPDATE_ERROR:
                return responseClient(res, 203, 1, '删除出错!', null);
        }
    });
})
export default router;