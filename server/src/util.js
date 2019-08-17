import crypto from 'crypto';
import {
    verify,
} from 'jsonwebtoken';
import {
    status,
} from './constants';

export const SHA2_SUFFIX = 'fyosjdskfzjsdksnfkdfl.ker两只黄鹂鸣翠柳@#￥%……&^》》M';
/**
 * sha2加密函数
 * @param {*} pwd 原始密码
 */
export function sha2(pwd) {
    const sha2 = crypto.createHash('sha256');
    return sha2.update(pwd).digest('hex');
};
/**
 * 对响应进行二次封装的函数
 * @param {*} res express响应对象
 * @param {*} httpCode 状态码
 * @param {*} code 用于前端判断响应是否成功
 * @param {*} message 状态描述信息
 * @param {*} data 响应数据主体
 */
export function responseClient(res, httpCode = 500, code = 3, message = '服务端异常', data = {}) {
    const responseData = {};
    // const content_type = res.get('Content-Type') === 'image/svg+xml';
    responseData.code = code;
    responseData.message = message;
    responseData.data = data;
    res = res.status(httpCode);
    res.get('Content-Type') ? res.send(data) : res.json(responseData);
}
/**
 * 用于初始化数据库的函数
 * @param {*} batches 用于初始化数据的对象
 */
export async function initDB(batches) {
    for (let i = 0; i < batches.length; ++i) {
        const {
            service,
            initObj,
            queryKey,
            successMsg,
            // handleObj,
        } = batches[i];
        for (let j = 0; j < initObj.length; ++j) {
            const role = initObj[j];
            await service.create(role, {
                [queryKey]: role[queryKey],
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
            });
        }
    }
}
/**
 * 获取mongoose查询结果的纯对象
 * @param {*} obj 原始对象(被冻结)
 * @param {*} keys 原始对象属性名数组
 */
export function getPlainObj(obj, keys) {
    const plain = {};
    plain._id = obj._id;
    for (const k of keys) {
        plain[k] = obj[k];
    }
    return plain;
}
/**
 * 验证token
 * @param {*} token 生成的jwt字符串
 * @param {*} secret 密钥值
 */
export function verifyToken(token, secret) {
    return new Promise(function (resolve, reject) {
        verify(token, secret, function (error, payload) {
            if (error) {
                reject(error);
            } else {
                resolve(payload);
            }
        });
    });
}