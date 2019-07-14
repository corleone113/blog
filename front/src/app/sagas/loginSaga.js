import {
    take,
    put,
    call
} from 'redux-saga/effects';
import {
    post
} from '../fetch'
import {
    loginActions,
    defaultActions,
} from '../reducers/actionTypes';

function* signup(payload) {
    yield put({
        type: defaultActions.FETCH_START
    });
    try {
        return yield call(post, '/admin/login/signup', payload);
    } catch (err) {
        yield put({
            type: defaultActions.SET_MESSAGE,
            msgContent: '网络请求错误',
            msgType: 0
        });
    } finally {
        yield put({
            type: defaultActions.FETCH_END
        });
    }
}
export function* signupFlow() {
    while (true) {
        const req = yield take(
            loginActions.SIGNUP_REQ
        );
        const res = yield call(signup, req.payload);
        console.log('saga signup res:', res);
    }
}