import {
    combineReducers
} from 'redux'
// import {users} from './adminManagerUser'
import {
    reducer as tags
} from './tagReducer';
import {
    reducer as login
} from './loginReducer';
// import {reducer as newArticle} from "./adminManagerNewArticle";
// import {articles} from './adminManagerArticle'
import {
    adminActions
} from './actionTypes'

const initialState = {
    url: "/"
};

export const actions = {
    change_location_admin: function (url) {
        return {
            type: adminActions.ADMIN_URI_LOCATION,
            data: url
        }
    }
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case adminActions.ADMIN_URI_LOCATION:
            return {
                ...state, url: action.data
            };
        default:
            return state
    }
}

const admin = combineReducers({
    // adminGlobalState:reducer,
    // users,
    login,
    tags,
    // newArticle,
    // articles
});

export default admin