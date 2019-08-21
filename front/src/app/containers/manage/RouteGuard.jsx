import React from 'react';
import { Route, Redirect, } from 'react-router-dom';


/**
 * 获取用户导航栏中第一个有效菜单(能导航到某页面)
 * @param {*} menus 用户对应权限的导航菜单数组
 */
function getOneActivePath(menus) {
    for (const menu of menus) {
        if (menu.children.length === 0) {
            return menu.route;
        } else {
            return getOneActivePath(menu.children);
        }
    }
    return '';
}

/**
 * 验证当前浏览器URL访问的页面是否在用户权限范围内
 * @param {*} path 浏览器当前URL
 * @param {*} menus 用户对应权限的导航菜单数组
 */
function getAuthResult(path, menus) {
    for (const menu of menus) {
        if (menu.children.length === 0
            && menu.route === path) {
            return true;
        }
        if (menu.children.length > 0) {
            const r = getAuthResult(path, menu.children);
            if (r) return r;
            else continue;
        }
    }
    return false;
}

function whenNoAuth(method, logout) {
    method('该用户没有任何权限，登录管理页面失败，请联系管理员!');
    logout();
    return <Redirect to="/login" />;
}
function whenNotSignIn(method, logout) {
    method('请登录!');
    logout();
    return <Redirect to="/login" />;
}

function whenAuth(redirect, routes) {
    return (
        <>
            <Redirect to={redirect} />
            {
                routes.map(route => (
                    <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />
                ))
            }
        </>
    );
}
export default function ({ routes, location, userInfo, manage_error, logout, }) {
    if (!userInfo) {
        return whenNotSignIn(manage_error, logout);
    }
    const { menus, } = userInfo;
    const { pathname, } = location;
    if (pathname === '/admin/manage') {
        if (menus.length === 0) {
            return whenNoAuth(manage_error, logout);
        } else {
            const activePath = getOneActivePath(menus);
            for (const route of routes) {
                if (route.path === activePath) {
                    return whenAuth(activePath, routes);
                }
            }
        }
    } else {
        const result = getAuthResult(pathname, menus);
        if (!result) {
            return <Redirect to="/admin/manage" />;
        } else {
            for (const route of routes) {
                if (route.path === pathname) {
                    return <Route path={pathname} component={route.component} exact={route.exact} />;
                }
            }
        }
    }
    return whenNoAuth(manage_error, logout);
}