import {
    frontActions,
} from './actionTypes';
import {
    combineReducers,
} from 'redux';
const initialState = {
    category: [],
    articleList: [],
    articleDetail: {},
    pageNum: 1,
    total: 0,
};
export const actions = {
    get_article_list: function (tag = '', pageNum = 1) {
        return {
            type: frontActions.GET_ARTICLE_LIST,
            tag,
            pageNum,
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
};

function articleReducer(state = initialState, action) {
    switch (action.type) {
        case frontActions.GET_ARTICLE_LIST_RES:
            return {
                ...state, articleList: [...action.data.list, ], pageNum: action.data.pageNum, total: action.data.total,
            };
        case frontActions.GET_ARTICLE_DETAIL_RES:
            return {
                ...state, articleDetail: action.data,
            };
        default:
            return state;
    }
}

function tagReducer(state = [], action) {
    switch (action.type) {
        case frontActions.GET_ALL_TAGS_RES:
            return ['首页', ...action.data, ];
        default:
            return state;
    }
}

export const reducer=combineReducers({
    articles:articleReducer,
    tags:tagReducer,
});