import { hot, } from 'react-hot-loader/root';
import React, { PureComponent, } from 'react';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import { notification, Layout, } from 'antd';
import 'normalize.css/normalize.css';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';
import { actions, } from '../reducers';
import NotFound from '../components/notFound/NotFound';
import Front from './front/Front';
import Login from './login/Login';
import style from './index.css';
// import Loading from '../components/loading/Loading';
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
  openNotification = (type, message) => {
    const that = this;
    notification[type]({
      message: message,
      onClose: () => {
        that.props.clear_msg();
      },
    });
    this.props.clear_msg();
  }
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route component={NotFound}
              path="/404"
            />
            <Route component={Login}
              path="/login"
            />
            <Route component={Front} />
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

function mapDispatchToProps(dispatch) {
  return {
    clear_msg: bindActionCreators(clear_msg, dispatch),
  };
}


export default hot(connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage));