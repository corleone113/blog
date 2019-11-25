import {
  take,
  put,
  call,
  select,
} from 'redux-saga/effects';
import {
  get,
} from '../fetch';
import {
  frontActions,
  defaultActions,
} from '../reducers/actionTypes';
let hasSetSessionMessage = false;

function* verify(res) {
  const fn = yield select(state => state.front.articles.fn);
  if (!res.data.user) {
    if (!hasSetSessionMessage &&
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('info')) {
      hasSetSessionMessage = true;
      setImmediate(() => {
        hasSetSessionMessage = false;
      });
      yield put({
        type: defaultActions.SET_MESSAGE,
        msgContent: '会话过期或登录信息丢失!已退出登录',
        msgType: 0,
      });
    }
    fn();
  }
}
export function* getArticlesListFlow(method) {
  while (true) {
    const {
      pageNum,
      pageSize,
      tag,
    } = yield take(frontActions.GET_ARTICLE_LIST);
    const res = yield call(method, get, `/getArticles?pageNum=${pageNum}&pageSize=${pageSize}&isPublish=true&tag=${tag}`);
    if (res) {
      if (res.code === 0) {
        yield call(verify, res);
        res.data.pageNum = pageNum;
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
        yield call(verify, res);
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
    if (res.code === 0) {
      yield call(verify, res);
      const tempArr = [];
      const {
        list,
      } = res.data;
      for (let i = 0; i < list.length; i++) {
        tempArr.push(list[i].name);
      }
      yield put({
        type: frontActions.GET_ALL_TAGS_RES,
        list: tempArr,
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