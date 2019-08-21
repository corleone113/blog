import {
    manageActions,
    defaultActions,
} from './actionTypes';

const initState = {
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0,
    // where: {},
    editVisible: false,
    record: {},
    isCreate: true,
    selectedRowKeys: [], //id数组
    selectedRows: [], //对象数组
    resourceVisible: false,
    checkedKeys: [],
    resources: [],
    userVisible: false,
    targetKeys: [],
    targetRole: '',
    roles: [],
    tags: [],
};

export const actions = {
    manage_get_all(entity, query) {
        return {
            type: manageActions.MANAGE_GET_ALL_REQ,
            entity,
            query,
        };
    },
    manage_get(
        entity,
        payload,
    ) {
        return {
            type: manageActions.MANAGE_GET_REQ,
            entity,
            payload: {
                ...payload,
                pageNum: payload.pageNum || 1,
                pageSize: payload.pageSize || 5,
            },
        };
    },
    manage_create(
        entity,
        payload,
        query,
    ) {
        return {
            type: manageActions.MANAGE_CREATE_REQ,
            entity,
            payload,
            query,
        };
    },
    manage_set(
        entity,
        payload,
        query,
    ) {
        return {
            type: manageActions.MANAGE_SET_REQ,
            entity,
            payload,
            query,
        };
    },
    manage_delete(
        entity,
        payload,
        id,
        query,
    ) {
        return {
            type: manageActions.MANAGE_DELETE_REQ,
            id,
            payload,
            entity,
            query,
        };
    },
    manage_change(payload) {
        return {
            type: manageActions.MANAGE_RES,
            payload,
        };
    },
    manage_error(msg) {
        return {
            type: defaultActions.SET_MESSAGE,
            msgContent: msg,
            msgType: 0,
        };
    },
    manage_relative_delete(entity,
        relative,
        beforeQuery,
        getSets,
        id,
        payload,
        query, ) {
        return {
            type: manageActions.MANAGE_RELATIVE_DELETE,
            entity,
            relative,
            beforeQuery,
            getSets,
            id,
            payload,
            query,
        };
    },
    manage_provide(method) {
        return {
            type: manageActions.MANAGE_PROVIDE_API,
            method,
        };
    },
    manage_logout() {
        return {
            type: manageActions.MANAGE_LOGOUT,
        };
    },
};

export function reducer(state = initState, action) {
    switch (action.type) {
        case manageActions.MANAGE_RES:
            return {
                ...state,
                ...action.payload,
            };
        case manageActions.MANAGE_PROVIDE_API:
            return {
                ...state,
                method: action.method,
            };
        default:
            return state;
    }

}