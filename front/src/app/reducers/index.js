import {
    reducer as front,
} from './frontReducer';
import {
    reducer as login,
} from './loginReducer';
import {
    reducer as manage,
} from './manageReducer';
import {
    defaultActions,
} from './actionTypes';
import {
    combineReducers,
} from 'redux';
const initialState = {
    isFetching: false,
    msg: {
        type: 1, //0失败，1成功，2会话过期
        content: '',
    },
};
export const actions = {
    clear_msg: function () {
        return {
            type: defaultActions.SET_MESSAGE,
            msgType: 1,
            msgContent: '',
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
        default:
            return state;
    }
}
export default combineReducers({
    front,
    globalState: reducer,
    login,
    manage,
});