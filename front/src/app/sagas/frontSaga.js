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

export function* getArticlesListFlow(method) {
  while (true) {
    const req = yield take(frontActions.GET_ARTICLE_LIST);
    const res = yield call(method, get, `/getArticles?pageNum=${req.pageNum}&isPublish=true&tag=${req.tag}`);
    if (res) {
      if (res.code === 0) {
        res.data.pageNum = req.pageNum;
        yield put({
          type: frontActions.GET_ARTICLE_LIST_RES,
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

export function* getArticleDetailFlow(method) {
  while (true) {
    const req = yield take(frontActions.GET_ARTICLE_DETAIL);
    const res = yield call(method, get, `/getArticleDetail?id=${req.id}`);
    if (res) {
      if (res.code === 0) {
        yield put({
          type: frontActions.GET_ARTICLE_DETAIL_RES,
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


export function* getAllTagsFlow(method) {
  while (true) {
    yield take(frontActions.GET_ALL_TAGS);
    const res = yield call(method, get, '/getAllTags');
    // console.log('the res:', res);
    if (res.code === 0) {
      const tempArr = [];
      for (let i = 0; i < res.data.length; i++) {
        tempArr.push(res.data[i].name);
      }
      yield put({
        type: frontActions.GET_ALL_TAGS_RES,
        data: tempArr,
      });
    } else {
      yield put({
        type: defaultActions.SET_MESSAGE,
        msgContent: res.message,
        msgType: 1,
      });
    }
  }
}