import {
    take,
    put,
    call,
    select,
} from 'redux-saga/effects';
import {
    manageActions,
    defaultActions,
} from '../reducers/actionTypes';
import {
    get,
    request,
} from '../fetch';
import querystring from 'querystring';

function* setMessage(res) {
    if (res) {
        yield put({
            type: defaultActions.SET_MESSAGE,
            msgContent: res.message,
            msgType: res.code === 0 ? 1 : 0,
        });
        if (res.code === 2 || res.data === 2) {
            // 查找来自Manage组件提供的登出接口
            const logout = yield select(state => state.manage.method);
            logout();
        }
    } else {
        yield put({
            type: defaultActions.SET_MESSAGE,
            msgContent: '无响应或未知的网络错误',
            msgType: 0,
        });
    }
}

function* manageRes(data) {
    yield put({
        type: manageActions.MANAGE_RES,
        payload: {
            ...data,
        },
    });
}

export function* manageLogout(method) {
    while (true) {
        yield take(manageActions.MANAGE_LOGOUT);
        const res = yield call(method, get, 'admin/logout');
        yield call(setMessage, res);
    }
}

export function* manageGetAllFlow(method) {
    while (true) {
        const {
            entity,
            query,
        } = yield take(
            manageActions.MANAGE_GET_ALL_REQ
        );
        const res = yield call(method, get, `admin/manage/${entity}?pageSize=n&${querystring.stringify(query)}`);
        if (res && res.data)
            yield call(manageRes, {
                [`${entity}s`]: res.data.list,
            });
    }
}

export function* manageGetFlow(method) {
    while (true) {
        const {
            payload,
            entity,
        } = yield take(
            manageActions.MANAGE_GET_REQ
        );
        const {
            pageNum,
            pageSize,
            ...where
        } = payload;
        let url = `admin/manage/${entity}?pageNum=${pageNum?pageNum:1}&pageSize=${pageSize?pageSize:5}`;
        if (where && Object.keys(where).length > 0) {
            url += `&${querystring.stringify(where)}`;
        }
        console.log('the where:', where, querystring.stringify(where));
        const res = yield call(method, get, url);
        if (res.code !== 0 || res.data === null) {
            yield call(setMessage, res);
            continue; // 不能使用return，否则会跳出循环
        }
        yield call(manageRes, {
            list: res.data.list,
            total: res.data.total,
            pageNum: payload.pageNum,
        });
    }
}

function* afterRequest(res, entity, query) {
    yield call(setMessage, res);
    yield put({
        type: manageActions.MANAGE_GET_REQ,
        entity,
        payload: query ? query : {
            pageNum: 1,
            pageSize: 5,
        },
    });
}
export function* manageCreateFlow(method) {
    while (true) {
        const {
            entity,
            payload,
            query,
        } = yield take(manageActions.MANAGE_CREATE_REQ);
        const res = yield call(method, request, {
            url: `admin/manage/${entity}`,
            method: 'POST',
            data: payload,
        });
        yield call(manageRes, {
            editVisible: false,
        });
        if (res.code !== 0) {
            yield call(setMessage, res);
            continue; // 不能使用return，否则会跳出循环
        }
        yield call(afterRequest, res, entity, query);
    }
}
export function* manageSetFlow(method) {
    while (true) {
        const {
            entity,
            payload,
            query,
        } = yield take(manageActions.MANAGE_SET_REQ);
        const res = yield call(method, request, {
            url: `admin/manage/${entity}`,
            method: 'PUT',
            data: payload,
        });
        yield call(manageRes, {
            editVisible: false,
            resourceVisible: false,
            [`${entity}Visible`]: false,
            selectedRowKeys: [],
            selectedRows: [],
            targetKeys: [],
        });
        if (!res || res.code !== 0) {
            yield call(setMessage, res);
            continue; // 不能使用return，否则会跳出循环
        }
        yield call(afterRequest, res, entity, query);
    }
}
export function* manageDeleteFlow(method) {
    while (true) {
        const {
            id,
            entity,
            payload,
            query,
        } = yield take(manageActions.MANAGE_DELETE_REQ);
        let url = `admin/manage/${entity}`;
        id && (url += `/${id}`);
        const config = {
            url,
            method: 'DELETE',
        };
        payload && (config.data = payload);
        const res = yield call(method, request, config);
        yield call(manageRes, {
            editVisible: false,
            selectedRowKeys: [], //id数组
            selectedRows: [], //对象数组
        });
        if (!res || res.code !== 0) {
            yield call(setMessage, res);
            continue; // 不能使用return，否则会跳出循环
        }
        yield call(afterRequest, res, entity, query);
    }
}

export function* manageRelativeDeleteFlow(method) {
    while (true) {
        const {
            entity,
            relative,
            beforeQuery,
            getSets,
            id,
            payload,
            query,
        } = yield take(manageActions.MANAGE_RELATIVE_DELETE);
        try {
            for (const query of beforeQuery) {
                const res = yield call(method, get, `admin/manage/${relative}?pageSize=n&${querystring.stringify(query)}`);
                const ids = [],
                    sets = [];
                if (res.data.list.length === 0) {
                    continue;
                }
                for (const item of res.data.list) {
                    ids.push(item._id);
                    sets.push(getSets(query, item));
                }
                const setData = {
                    ids,
                    sets,
                };
                console.log('the setData:', setData);
                yield call(request, {
                    url: `admin/manage/${relative}`,
                    method: 'PUT',
                    data: setData,
                });
            }
            yield put({
                type: manageActions.MANAGE_DELETE_REQ,
                id,
                entity,
                payload,
                query,
            });
        } catch (err) {
            console.error('Catch the error:', err);
            yield put({
                type: defaultActions.SET_MESSAGE,
                msgContent: '删除中途失败，已回滚!',
                msgType: 0,
            });
        }
    }
}