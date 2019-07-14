import {
    tagActions
} from './actionTypes';

const initialState = ['首页'];

export const actions = {
    get_all_tags: function () {
        return {
            type: tagActions.GET_ALL_TAGS
        }
    },
    delete_tag: function (name) {
        return {
            type: tagActions.DELETE_TAG,
            name
        }
    },
    add_tag: function (name) {
        return {
            type: tagActions.ADD_TAG,
            name
        }
    }
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case tagActions.SET_TAGS:
            return ['首页', ...action.data];
        default:
            return state;
    }
}