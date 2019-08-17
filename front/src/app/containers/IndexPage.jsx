import { hot, } from 'react-hot-loader/root';
import React, { PureComponent, } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, } from 'react-router-dom';
import { notification, Layout, } from 'antd';
import 'normalize.css/normalize.css';
import { connect, } from 'react-redux';
import { actions, } from '../reducers';
import NotFound from '../components/notFound/NotFound';
import Front from './front/Front';
import Login from './login/Login';
import Manage from './manage/Manage';
import style from './index.css';
const { clear_msg, } = actions;
const { Footer, } = Layout;
class IndexPage extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    if (this.props.notification && this.props.notification.content) {
      this.props.notification.type === 1 ?
        this.openNotification('success', this.props.notification.content) :
        this.openNotification('error', this.props.notification.content);
    }
  }
  //暂时取消调用clear_msg,防止多余的渲染
  openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  }
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route component={Manage} path="/admin/manage" />
            <Route component={Login}
              path="/login"
            />
            <Route component={Front} path="/public" />
            <Redirect exact from="/" to="/public" />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Footer className={style.footer}>
          Corleone Blog @2019
          </Footer>
      </>
    );
  }
}
function mapStateToProps(state) {
  // debugger;
  return {
    notification: state.globalState.msg,
    userInfo: state.globalState.userInfo,
  };
}

export default hot(connect(
  mapStateToProps,
  { clear_msg, }
)(IndexPage));