import {
    loginActions
} from './actionTypes';
const initialState = {
    to: 'goto_signin',
    logined: false,
}
export const actions = {
    goto_signin: () => {
        return {
            type: loginActions.GOTO_SIGNIN
        }
    },
    goto_signup: () => {
        return {
            type: loginActions.GOTO_SIGNUP
        }
    },
    signup: (data) => {
        return {
            type: loginActions.SIGNUP_REQ,
            payload: data,
        }
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case loginActions.GOTO_SIGNIN:
            return {
                ...state,
                to: 'goto_signin',
            };
        case loginActions.GOTO_SIGNUP:
            return {
                ...state,
                to: 'goto_signup',
            };
        case loginActions.SIGNUP_RES:
            return {
                ...state,
                to: 'signup',
                data: action.data
            };
        default:
            return state;
    }
}