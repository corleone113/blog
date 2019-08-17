import React, { PureComponent, } from 'react';
import { Menu, Dropdown, Icon, } from 'antd';
import style from './style.css';
export default
  class Toolbar extends PureComponent {

  render() {
    const { items, title, overClass, } = this.props;
    const menu = (
      <Menu>
        {items.map((item) => (
          <Menu.Item key={item.title}>
            <span className="ant-dropdown-link"
              onClick={item.todo}
            >
              {item.title}
            </span>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <span className={overClass}>
        <Dropdown overlay={menu}
          overlayClassName={style.drop}
        >
          <span className="ant-dropdown-link"
          >
            {title} <Icon type="down" />
          </span>
        </Dropdown>
      </span>
    );
  }
}