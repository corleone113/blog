import React from 'react';
import { Menu, Icon, } from 'antd';
import { Link, } from 'react-router-dom';
const { SubMenu, } = Menu;
export default class extends React.Component {
    renderMenus = (resources) => {
        return resources.map(resource => {
            if (resource.children.length > 0) {
                return (
                    <SubMenu key={resource.route} title={<span><Icon type={resource.icon} />{resource.name}</span>}>
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
        const defaultKey=userInfo.menus.length>0?userInfo.menus[0].route:'';
        return (
            <Menu
                theme="dark"
                defaultOpenKeys={[defaultKey, ]}
                mode="inline"
                defaultSelectedKeys={[location.pathname, ]}
                selectedKeys={[location.pathname, ]}
            >
                {this.renderMenus(userInfo.menus)}
            </Menu>
        );
    }
}