import {
    status,
} from '../constants';
import {
    getPlainObj,
} from '../util';
export default class Base {
    // constructor(model, query) {
    //     this.model = model;
    //     this.query = query;
    // }
    findAll(query, ...columns) {
        return new Promise((resolve, reject) => {
            this.Model.find(query, ...columns).exec((err, data) => {
                if (err) reject(err);
                const keys = Object.keys(this.Model.schema.obj);
                const plain = [];
                for (const d of data) {
                    plain.push(getPlainObj(d, keys));
                }
                resolve(plain);
            });
        });
    }
    find(query, cb, ...columns) {
        if (query.order) { // 将查询字符串中的排序的字符串转化为对象的形式，用于mongoose查询方法中使用
            const arr = query.order.split(',');
            const obj = {};
            for (let i = 0; i < arr.length; i += 2) {
                obj[arr[i]] = parseInt(arr[i + 1]);
            }
            query.order = obj;
        }
        const {
            order,
            pageSize,
            pageNum,
            ...conditions
        } = query;
        const offset = (pageNum - 1) * pageSize;
        this.Model.
        count(conditions).
        exec((err, data) => {
            if (err) {
                return cb({
                    status: status.QUERY_ERROR,
                    data: err,
                });
            }
            const total = data;
            this.Model.
            find(conditions, ...columns).
            sort({
                ...order,
                _id: 1,
            }).
            skip(offset).
            limit(parseInt(pageSize)).
            exec((err, data) => {
                cb({
                    status: err ? status.QUERY_ERROR : status.SUCCESS,
                    data: err ? err : {
                        total,
                        list: Array.from(data),
                    },
                });
            });
        });
    }

    create(model, query, cb) {
        this.Model.findOne(query).then(result => {
            if (!result) {
                const entity = new this.Model(model);
                entity.save((err, data) => {
                    if (err) {
                        throw new Error(err);
                    }
                    const keys = Object.keys(this.Model.schema.obj);
                    cb({
                        data: getPlainObj(data, keys),
                        status: status.SUCCESS,
                    });
                });
            } else {
                cb({
                    status: status.EXISTED,
                });
            }
        }).catch(err => {
            cb({
                status: status.QUERY_ERROR,
                data: err,
            });
        });
    }

    async update(query, cb) {
        const {
            ids,
            sets,
        } = query;
        const datas = [];
        for (let i = 0; i < ids.length; ++i) {
            await this.Model.
            findByIdAndUpdate(ids[i], {
                $set: {
                    ...sets[i],
                },
            }, {
                new: true,
                useFindAndModify: true,
            }, (err, data) => {
                if (i === ids.length - 1) {
                    datas.push(data);
                    return cb({
                        status: err ? status.UPDATE_ERROR : status.SUCCESS,
                        data: err ? err : data,
                    });
                }
                datas.push(data);
            });
        }
    }

    async delete(query, cb) {
        const {
            ids,
        } = query;
        const result = {
            n: 0,
            ok: 0,
            deletedCount: 0,
        };
        for (let i = 0; i < ids.length; ++i) {
            await this.Model.deleteOne({
                _id: ids[i],
            }, (err, data) => {
                if (data) {
                    for (const k of Object.keys(result)) {
                        result[k] += parseInt(data[k]);
                    }
                }
                if (i === ids.length - 1) {
                    return cb({
                        status: err ? status.UPDATE_ERROR : status.SUCCESS,
                        data: result,
                    });
                }
            });
        }
    }
}