import {
    status
} from '../constants'
export default class Base {
    find(cb) {
        const {
            order,
            pageSize,
            pageNum,
            ...conditions
        } = this.query;
        const offset = (pageNum - 1) * pageSize;
        this.Model.
        count(conditions).
        exec((err, data) => {
            if (err) {
                return cb({
                    status: status.QUERY_ERROR,
                    data: err,
                })
            }
            const total = data;
            this.Model.
            find(conditions).
            sort({
                ...order,
                _id: 1
            }).
            skip(offset).
            limit(parseInt(pageSize)).
            exec((err, data) => {
                cb({
                    status: err ? status.QUERY_ERROR : status.SUCCESS,
                    data: err ? err : {
                        ...data,
                        total
                    },
                })
            });
        })
    }

    create(cb) {
        this.Model.findOne(this.query).then(result => {
            if (!result) {
                const entity = new this.Model(this.model);
                console.log('model save:', entity.save((err, data) => {
                    if (err) {
                        throw new Error(err);
                    }
                    cb({
                        data,
                        status: status.SUCCESS,
                    })
                }))
            } else {
                cb({
                    status: status.EXISTED
                })
            }
        }).catch(err => {
            console.error(err);
            cb({
                status: status.QUERY_ERROR
            })
        })
    }

    async update(cb) {
        const {
            ids,
            sets
        } = this.query;
        const datas = [];
        for (let i = 0; i < ids.length; ++i) {
            await this.Model.
            findByIdAndUpdate(ids[i], {
                $set: {
                    ...sets[i]
                }
            }, {
                new: true,
                useFindAndModify: true
            }, (err, data) => {
                if (i === ids.length - 1) {
                    datas.push(data);
                    return cb({
                        status: err ? status.UPDATE_ERROR : status.SUCCESS,
                        data: datas
                    });
                }
                datas.push(data);
            });
        }
    }
}