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
} from './manageSaga';
import {
  defaultActions,
} from '../reducers/actionTypes';

function* launchRequest(method, ...params) {
  yield put({
    type: defaultActions.FETCH_START,
  });
  try {
    return yield call(method, ...params);
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
  ].map(method => method(launchRequest)));
}