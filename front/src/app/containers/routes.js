import {
    Route,
    Redirect,
} from 'react-router-dom';
import {
    get,
} from '@/fetch';
import {
    frontActions,
} from '@/reducers/actionTypes';
import loadable from '@loadable/component';
import Front from './front/Front';

const Manage = loadable(()=>import('./manage/Manage'));
const NotFound = loadable(()=>import('@/components/notFound/NotFound'));
const Login = loadable(()=>import('./login/Login'));

export const ssrLoadFns = {
    '/public': [
        (baseUrl) => ({
            dispatch,
        }) => {
            return get(`${baseUrl}/getArticles?pageNum=1&pageSize=5&isPublish=true&tag=`).then(result => {
                const {
                    data,
                } = JSON.parse(result);
                dispatch({
                    type: frontActions.GET_ARTICLE_LIST_RES,
                    data,
                });
                return Promise.resolve(data);
            });
        },
        (baseUrl, cookie) => ({
            dispatch,
        }, ) => {
            return get(`${baseUrl}/getAllTags`, {
                headers: {
                    Cookie: cookie ? cookie : '',
                },
            }).then(result => {
                const {
                    data,
                } = JSON.parse(result);
                const tempArr = [];
                const {
                    list,
                    user,
                } = data;
                for (let i = 0; i < list.length; i++) {
                    tempArr.push(list[i].name);
                }
                dispatch({
                    type: frontActions.GET_ALL_TAGS_RES,
                    list: tempArr,
                    user,
                });
                return Promise.resolve(data);
            });
        },
    ],
};
export const ssrVerify = (baseUrl, cookie) => (context) => {
    let url=`${baseUrl}/admin/manage/verify`;
    if(context.justStart){
        url+='/1';
        context.justStart=false;
    }
    return get(url, {
        headers: {
            Cookie: cookie ? cookie : '',
        },
    }).then(result => {
        const {
            data,
        } = JSON.parse(result);
        context.user = data;
        return Promise.resolve(data);
    });
};
export default [{
        Comp: Route,
        component: Manage,
        path: '/admin/manage',
        key: '/admin/manage',
    },
    {
        Comp: Route,
        component: Login,
        path: '/login',
        key: '/login',
        exact: true,
    },
    {
        Comp: Route,
        component: Front,
        path: '/public',
        key: '/public',
    },
    {
        Comp: Redirect,
        from: '/',
        key: '/',
        to: '/public',
        exact: true,
    },
    {
        Comp: Route,
        key: '/notfound',
        component: NotFound,
    },
];