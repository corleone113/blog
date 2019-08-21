import {
  all,
  call,
  put,
} from 'redux-saga/effects';
import {
  getArticlesListFlow,
  getArticleDetailFlow,
  getAllTagsFlow,
} from './frontSaga';
import {
  signUpOrInFlow,
} from './loginSaga';
import {
  manageGetFlow,
  manageGetAllFlow,
  manageCreateFlow,
  manageSetFlow,
  manageDeleteFlow,
  manageLogout,
  manageRelativeDeleteFlow,
} from './manageSaga';
import {
  defaultActions,
} from '../reducers/actionTypes';

function* launchRequest(method, ...params) {
  yield put({
    type: defaultActions.FETCH_START,
  });
  try {
    const res = yield call(method, ...params);
    if (!res) throw new Error('无响应!请查看后台控制台信息');
    else return res;
  } catch (err) {
    yield put({
      type: defaultActions.SET_MESSAGE,
      msgContent: '网络请求错误',
      msgType: 0,
    });
  } finally {
    yield put({
      type: defaultActions.FETCH_END,
    });
  }
}

export default function* rootSaga() {
  yield all([
    getAllTagsFlow,
    getArticlesListFlow,
    getArticleDetailFlow,
    signUpOrInFlow,
    manageGetFlow,
    manageGetAllFlow,
    manageCreateFlow,
    manageSetFlow,
    manageDeleteFlow,
    manageLogout,
    manageRelativeDeleteFlow,
  ].map(method => method(launchRequest)));
}