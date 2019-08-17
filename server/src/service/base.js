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
    findAll(query) {
        return new Promise((resolve, reject) => {
            this.Model.find(query).exec((err, data) => {
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
    find(query, cb) {
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
            find(conditions).
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
                        list: Array.from(data),
                        total,
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
                        data: datas,
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