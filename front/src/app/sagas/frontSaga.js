import {
  take,
  put,
  call,
} from 'redux-saga/effects';
import {
  get,
} from '../fetch';
import {
  frontActions,
  defaultActions,
} from '../reducers/actionTypes';


export function* getArticleList(tag, pageNum) {
  yield put({
    type: defaultActions.FETCH_START,
  });
  try {
    return yield call(get, `/getArticles?pageNum=${pageNum}&isPublish=true&tag=${tag}`);
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

export function* getArticlesListFlow() {
  while (true) {
    const req = yield take(frontActions.GET_ARTICLE_LIST);
    const res = yield call(getArticleList, req.tag, req.pageNum);
    console.log('front saga articles data:', res.data);
    if (res) {
      if (res.code === 0) {
        res.data.pageNum = req.pageNum;
        yield put({
          type: frontActions.RESPONSE_ARTICLE_LIST,
          data: res.data,
        });
      } else {
        yield put({
          type: defaultActions.SET_MESSAGE,
          msgContent: res.message,
          msgType: 0,
        });
      }
    }
  }
}

export function* getArticleDetail(id) {
  yield put({
    type: defaultActions.FETCH_START,
  });
  try {
    return yield call(get, `/getArticleDetail?id=${id}`);
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

export function* getArticleDetailFlow() {
  while (true) {
    const req = yield take(frontActions.GET_ARTICLE_DETAIL);
    const res = yield call(getArticleDetail, req.id);
    if (res) {
      if (res.code === 0) {
        yield put({
          type: frontActions.RESPONSE_ARTICLE_DETAIL,
          data: res.data,
        });
      } else {
        yield put({
          type: defaultActions.SET_MESSAGE,
          msgContent: res.message,
          msgType: 0,
        });
      }
    }
  }
}