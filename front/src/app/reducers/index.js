import {
    reducer as front,
} from './frontReducer';
import {
    defaultActions,
} from './actionTypes';
import {
    combineReducers,
} from 'redux';
import admin from './admin';
const initialState = {
    isFetching: true,
    msg: {
        type: 1, //0失败，1成功
        content: '',
    },
    userInfo: {},
};
export const actions = {
    get_login: function (username, password) {
        return {
            type: defaultActions.USER_LOGIN,
            username,
            password,
        };
    },
    get_register: function (data) {
        return {
            type: defaultActions.USER_REGISTER,
            data,
        };
    },
    clear_msg: function () {
        return {
            type: defaultActions.SET_MESSAGE,
            msgType: 1,
            msgContent: '',
        };
    },
    user_auth: function () {
        return {
            type: defaultActions.USER_AUTH,
        };
    },
};
export function reducer(state = initialState, action) {
    switch (action.type) {
        case defaultActions.FETCH_START:
            return {
                ...state, isFetching: true,
            };
        case defaultActions.FETCH_END:
            return {
                ...state, isFetching: false,
            };
        case defaultActions.SET_MESSAGE:
            return {
                ...state,
                isFetching: false,
                    msg: {
                        type: action.msgType,
                        content: action.msgContent,
                    },
            };
        case defaultActions.RESPONSE_USER_INFO:
            return {
                ...state, userInfo: action.data,
            };
        default:
            return state;
    }
}
export default combineReducers({
    front,
    globalState: reducer,
    admin,
});