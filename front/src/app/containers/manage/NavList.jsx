import React from 'react';
import { Menu, Icon, } from 'antd';
import { Link, } from 'react-router-dom';
const { SubMenu, } = Menu;
export default class extends React.Component {
    defaultKeys=['', ]; // 保存打开的key的数组
    // 点击submenu时更改defaultKeys的内容，有则删除，没有则添加，点击子菜单时无影响，因为子菜单点击会改变路由，render方法中又会根据路由重新生成defualtKeys，不加这个事件监听器会导致点击submenu无法展开和收起。
    changeOpenKeys = (e) => {
        if (this.defaultKeys.includes(e.key)) {
            const index = this.defaultKeys.indexOf(e.key);
            this.defaultKeys.splice(index, 1);
        } else {
            this.defaultKeys.unshift(e.key);
        }
    }
    renderMenus = (resources) => {
        return resources.map(resource => {
            if (resource.children.length > 0) {
                return (
                    <SubMenu onTitleClick={this.changeOpenKeys} key={resource.route} title={<span><Icon type={resource.icon} />{resource.name}</span>}>
                        {this.renderMenus(resource.children)}
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={resource.route}>
                        <Link to={resource.route}><Icon type={resource.icon} /><span>{resource.name}</span></Link>
                    </Menu.Item>
                );
            }
        });
    }
    render() {
        const { userInfo, location, } = this.props;
        if (!userInfo) {
            return null;
        }
        this.defaultKeys = getDefaultOpenKeys(location.pathname, userInfo.menus);
        return (
            <Menu
                theme="dark"
                openKeys={this.defaultKeys}
                mode="inline"
                selectedKeys={[location.pathname, ]}
            >
                {this.renderMenus(userInfo.menus)}
            </Menu>
        );
    }
}

function getDefaultOpenKeys(path, menus) {
    const keys = new Set([]);
    function recursiveSeek(path, menus) {
        for (const menu of menus) {
            if (menu.route === path) {
                return true;
            }
            if (menu.children.length > 0) {
                const r = recursiveSeek(path, menu.children);
                if (r) {
                    keys.add(menu.route);
                    return true;
                } else continue;
            }
        }
        return false;
    }
    recursiveSeek(path, menus);
    return Array.from(keys).reverse();
}