import {
  take,
  put,
  call,
  select,
} from 'redux-saga/effects';
import {
  post,
} from '../fetch';
import {
  loginActions,
  defaultActions,
} from '../reducers/actionTypes';
export function* signUpOrInFlow(method) {
  while (true) {
    const req = yield take(
      loginActions.SIGNUPORIN_REQ
    );
    const url = req.isSignIn ? '/admin/signin' : '/admin/signup';
    const res = yield call(method, post, url, req.payload);
    if (!(res.code === 0 && req.isSignIn)) {
      yield put({
        type: defaultActions.SET_MESSAGE,
        msgContent: res.message,
        msgType: res.code ===0 ? 1 : 0,
      });
    }

    if (res.code === 0) {
      yield put({
        type:loginActions.GOTO_SIGNIN,
      });
      const afterLogin = yield select(state => state.login.api);
      yield call(afterLogin, res.data);
    }
  }
}