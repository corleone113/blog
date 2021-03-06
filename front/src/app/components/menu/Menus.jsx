import React, { Component, } from 'react';
import { Menu, } from 'antd';
import style from './style';

export default class Menus extends Component {
  constructor(props) {
    super(props);
    const path = this.props.history.location.pathname;
    const current_tag = path.split('/')[2];
    this.state = {
      current: current_tag === undefined ? '首页' : current_tag,
    };
  }
  handleClick = (e) => {
    if (e.key === '首页') {
      this.props.getArticleList('');
    } else {
      this.props.getArticleList(e.key);
    }
    const toPath = e.key === '首页' ? '/public' : '/public/' + e.key;
    this.setState({
      current: e.key,
    });
    this.props.history.push(toPath);
  };
  render() {
    return (
      <Menu className={style.MenuContainer}
        mode="inline"
        onClick={this.handleClick}
        selectedKeys={[this.state.current, ]}
        defaultSelectedKeys={[this.state.current, ]}
      >
        {
          this.props.categories.map((item) => (
            <Menu.Item key={item}>
              {item}
            </Menu.Item>
          ))
        }
      </Menu >
    );
  }
}