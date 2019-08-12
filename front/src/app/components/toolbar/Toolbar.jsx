import React, { PureComponent, } from 'react';
import { Menu, Dropdown, Icon, } from 'antd';
import style from './style.css';
export default
class Toolbar extends PureComponent {

  render() {
    const {items,} = this.props;
    const menu = (
      <Menu>
        {this.props.items.map((item) => (
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
      <div className={style.container}>
        <span>
          <Dropdown overlay={menu}
            overlayClassName={style.drop}
          >
            <span className="ant-dropdown-link"
              onClick={items[0].todo}
            >
              {items[0].title} <Icon type="down" />
            </span>
          </Dropdown>
        </span>
      </div>
    );
  }
}