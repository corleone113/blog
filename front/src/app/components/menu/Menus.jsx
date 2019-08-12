import React, { Component, } from 'react';
import { Menu, } from 'antd';
import style from './style';

export default class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.categories[0],
      // current: 'fuck'
    };
  }
  componentDidMount() {
    this.setState({
      current: this.props.history.location.pathname.replace('/', '') || '首页',
    });
  }
    handleClick = (e) => {
      if (e.key === '首页') {
        this.props.getArticleList('');
      } else {
        this.props.getArticleList(e.key);
      }
      const toPath = e.key === '首页' ? '/' : '/' + e.key;
      this.setState({
        current: e.key,
      });
      this.props.history.push(toPath);
    };
    render() {
      return (
        <Menu className={style.MenuContainer}
          mode="horizontal"
          onClick={this.handleClick}
          selectedKeys={[this.state.current, ]}
        >
          {
            this.props.categories.map((item) => (
              <Menu.Item key={item}>
                {item}
              </Menu.Item>
            ))
          }
        </Menu>
      );
    }
}