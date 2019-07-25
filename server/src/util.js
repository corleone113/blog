import crypto from 'crypto'
import {
    status
} from './constants'
import role_resource from './models/role_resource';
module.exports = {
    MD5_SUFFIX: 'fyosjdskfzjsdksnfkdfl.ker两只黄鹂鸣翠柳@#￥%……&^》》M',
    md5: function (pwd) {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res, httpCode = 500, code = 3, message = '服务端异常', data = {}) {
        const responseData = {};
        const isSVG = res.get('Content-Type') === 'image/svg+xml';
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        isSVG ? res.status(httpCode).send(data) : res.status(httpCode).json(responseData);
    },
    initDB: async (batches) => {
        for (let i = 0; i < batches.length; ++i) {
            const {
                service,
                initObj,
                queryKey,
                successMsg,
                handleObj
            } = batches[i];
            if (handleObj) {
                const savedObjs = new Map();
                const objs = [];
                next(0);
                function next(i) {
                    const role = initObj[i];
                    service.create(role, {
                        [queryKey]: role[queryKey]
                    }, r => {
                        switch (r.status) {
                            case status.SUCCESS:
                                savedObjs.set(role.name, r.data)
                                objs.push({
                                    _id: r.data._id,
                                    parent: role.parent,
                                })
                                if (i === initObj.length - 1) {
                                    handleObj(objs, savedObjs);
                                    return console.log(`${successMsg}`);
                                }
                                next(i + 1);
                                break;
                            case status.QUERY_ERROR:
                                return console.log(`发生错误！${r.data}`);
                            default:
                                return;
                        }
                    })
                }
            } else {
                for (let j = 0; j < initObj.length; ++j) {
                    const role = initObj[j];
                    await service.create(role, {
                        [queryKey]: role[queryKey]
                    }, r => {
                        switch (r.status) {
                            case status.SUCCESS:
                                if (j === initObj.length - 1) {
                                    return console.log(`${successMsg}`);
                                }
                                break;
                            case status.QUERY_ERROR:
                                return console.log(`发生错误！${r.data}`);
                            default:
                                return;
                        }
                    })
                }
            }

        }
    }
}