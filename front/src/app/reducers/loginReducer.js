import {
    loginActions,
} from './actionTypes';
const initialState = {
    to: 'goto_signin',
    logined: false,
    par: Date.now(),
};
export const actions = {
    goto_signin: () => {
        return {
            type: loginActions.GOTO_SIGNIN,
        };
    },
    goto_signup: () => {
        return {
            type: loginActions.GOTO_SIGNUP,
            par: Date.now(),
        };
    },
    signUpOrIn: (isSignIn, payload) => {
        return {
            type: loginActions.SIGNUPORIN_REQ,
            isSignIn,
            payload,
        };
    },
    provide_api(api) {
        return {
            type: loginActions.PROVIDE_API,
            api,
        };
    },
};

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
                    par: action.par ? action.par : state.par,
            };
        case loginActions.SIGNUPORIN_RES:
            return {
                ...state,
                payload: action.data,
            };
        case loginActions.PROVIDE_API:
            return {
                ...state,
                api: action.api,
            };
        default:
            return state;
    }
}