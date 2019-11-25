import { hot, } from 'react-hot-loader/root';
import React, { PureComponent, } from 'react';
import { BrowserRouter, Switch, } from 'react-router-dom';
import { notification, } from 'antd';
import 'normalize.css/normalize.css';
import { connect, } from 'react-redux';
import { actions, } from '../reducers';
import routes from './routes';
import Footer from '@/components/footer';

const { clear_msg, } = actions;

class IndexPage extends PureComponent {
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
          <BrowserRouter>
            <Switch>
              {routes.map(route => {
                const { Comp, key, ...rest } = route;
                return <Comp key={key} {...rest} />;
              })}
            </Switch>
          </BrowserRouter>
          <Footer />
        </>
    );
  }
}
function mapStateToProps(state) {
  return {
    notification: state.globalState.msg,
  };
}
let DefaultIndex = connect(
  mapStateToProps,
  { clear_msg, }
)(IndexPage);
if (process.env.NODE_ENV === 'development') {
  DefaultIndex = hot(DefaultIndex);
}
export default DefaultIndex;