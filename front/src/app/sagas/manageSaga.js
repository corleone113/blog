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
        } = yield take(
            manageActions.MANAGE_GET_ALL_REQ
        );
        const res = yield call(method, get, `admin/manage/${entity}?pageSize=n`);
        console.log('^^^^^saga manage get all>>>> res:', res);
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
        const res = yield call(method, get, `admin/manage/${entity}?pageNum=${payload.pageNum}&pageSize=${payload.pageSize}&${querystring.stringify(payload.where)}`);
        console.log('^^^^^saga manage get res:', res);
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

function* afterRequest(res, search) {
    yield call(setMessage, res);
    yield put({
        type: manageActions.MANAGE_GET_REQ,
        entity: search,
        payload: {
            pageNum: 1,
            pageSize: 5,
            where: {},
        },
    });
}
export function* manageCreateFlow(method) {
    while (true) {
        const {
            entity,
            payload,
            search,
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
        yield call(afterRequest, res, search);
    }
}
export function* manageSetFlow(method) {
    while (true) {
        const {
            entity,
            payload,
            search,
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
        yield call(afterRequest, res, search);
    }
}
export function* manageDeleteFlow(method) {
    while (true) {
        const {
            id,
            entity,
            payload,
            search,
        } = yield take(manageActions.MANAGE_DELETE_REQ);
        let url = `admin/manage/${entity}`;
        id && (url += `/${id}`);
        const config = {
            url,
            method: 'DELETE',
        };
        payload && (config.data = payload);
        console.log('^^^^^^^^^^^^^', url);
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
        yield call(afterRequest, res, search);
    }
}