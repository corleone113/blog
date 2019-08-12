import {
    frontActions,
} from './actionTypes';
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
};
export function reducer(state = initialState, action) {
    switch (action.type) {
        case frontActions.RESPONSE_ARTICLE_LIST:
            return {
                ...state, articleList: [...action.data.list, ], pageNum: action.data.pageNum, total: action.data.total,
            };
        case frontActions.RESPONSE_ARTICLE_DETAIL:
            return {
                ...state, articleDetail: action.data,
            };
        default:
            return state;
    }
}