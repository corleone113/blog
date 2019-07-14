import {
    fork
} from 'redux-saga/effects';
import {
    getAllTagsFlow
} from './tagsSaga';
import {
    getArticlesListFlow,
    getArticleDetailFlow
} from './frontSaga';
import {
    signupFlow
} from './loginSaga'

export default function* rootSaga() {
    yield fork(getAllTagsFlow);
    yield fork(getArticlesListFlow);
    yield fork(getArticleDetailFlow);
    yield fork(signupFlow);
}