import {
    put,
    take,
    call
} from 'redux-saga/effects';
import {
    get
} from '../fetch';
import {
    tagActions,
    defaultActions
} from '../reducers/actionTypes';

export function* getAllTags() {
    yield put({
        type: defaultActions.FETCH_START
    });
    try {
        return yield call(get, '/getAllTags');
    } catch (err) {
        yield put({
            type: defaultActions.SET_MESSAGE,
            msgContent: '网络请求错误',
            msgType: 0
        });
    } finally {
        yield put({
            type: defaultActions.FETCH_END
        })
    }
}

export function* getAllTagsFlow() {
    while (true) {
        yield take(tagActions.GET_ALL_TAGS);
        let res = yield call(getAllTags);
        // console.log('the res:', res);
        if (res.code === 0) {
            let tempArr = [];
            for (let i = 0; i < res.data.length; i++) {
                tempArr.push(res.data[i].name)
            }
            yield put({
                type: tagActions.SET_TAGS,
                data: tempArr
            });
        } else if (res.message === '身份信息已过期，请重新登录') {
            yield put({
                type: defaultActions.SET_MESSAGE,
                msgContent: res.message,
                msgType: 1
            });
            setTimeout(function () {
                location.replace('/');
            }, 1000);
        } else {
            yield put({
                type: defaultActions.SET_MESSAGE,
                msgContent: res.message,
                msgType: 1
            });
        }
    }
}