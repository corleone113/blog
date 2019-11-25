import {
    frontActions,
} from './actionTypes';
import {
    combineReducers,
} from 'redux';
const articleInitState = {
    category: [],
    articleList: [],
    articleDetail: {},
    pageNum: 1,
    total: 0,
};
const tagInitState = {
    list: [],
};
export const actions = {
    get_article_list: function (tag = '', pageNum = 1, pageSize = 5) {
        return {
            type: frontActions.GET_ARTICLE_LIST,
            tag,
            pageNum,
            pageSize,
        };
    },
    get_article_detail: function (id) {
        return {
            type: frontActions.GET_ARTICLE_DETAIL,
            id,
        };
    },
    get_all_tags: function () {
        return {
            type: frontActions.GET_ALL_TAGS,
        };
    },
    provide_api: function (api) {
        return {
            type: frontActions.PROVIDE_API,
            api,
        };
    },
};

function articleReducer(state = articleInitState, action) {
    switch (action.type) {
        case frontActions.GET_ARTICLE_LIST_RES:
            const {
                list, pageNum, total,
            } = action.data;
            return {
                ...state, articleList: [...list, ], pageNum, total,
            };
        case frontActions.GET_ARTICLE_DETAIL_RES:
            return {
                ...state, articleDetail: action.data,
            };
        case frontActions.PROVIDE_API:
            return {
                ...state, fn: action.api,
            };
            default:
                return state;
    }
}

function tagReducer(state = tagInitState, action) {
    switch (action.type) {
        case frontActions.GET_ALL_TAGS_RES:
            const {
                list,
                user,
            } = action;
            return {
                ...tagInitState, list: ['首页', ...list, ], user,
            };
        default:
            return state;
    }
}

export const reducer = combineReducers({
    articles: articleReducer,
    tags: tagReducer,
});