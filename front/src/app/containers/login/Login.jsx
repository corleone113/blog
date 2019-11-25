import React, { PureComponent, } from 'react';
import loadable from '@loadable/component';
import { connect, } from 'react-redux';
import { actions as loginActions, } from '@/reducers/loginReducer';
import { actions as manageActions, } from '@/reducers/manageReducer';
import { actions as frontActions, } from '@/reducers/frontReducer';

const captchaUrl = 'http://localhost:2333/admin/captcha';
const LoginForm = loadable(() => import('./LoginForm'));

class LoginPage extends PureComponent {
  componentDidMount() {
    this.props.provide_api(this.afterLogin);
  }
  afterLogin = (userInfo) => {
    if (userInfo.menus.length === 0) {
      this.props.manage_error('该用户没有任何权限，无法登录，请联系管理员!');
    } else {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('info', JSON.stringify(userInfo));
      }
      this.props.history.push('/');
      this.props.get_all_tags();
      this.props.get_article_list();
    }
  }
  extraH = '';
  handleSubmit = (event) => {
    event.preventDefault();
    const values = this.loginForm.props.form.getFieldsValue();
    const isLogin = this.props.to === 'goto_signin';
    this.props.signUpOrIn(isLogin, values);
  }
  changeLoginStatus = () => {
    const key = this.props.to === 'goto_signin' ? 'goto_signup' : 'goto_signin';
    this.props[key]();
  }
  returnHome = () => {
    this.props.history.push('/');
  }
  render() {
    this.captchaUrl = captchaUrl + '?ts=' + Date.now();
    const isLogin = this.props.to === 'goto_signin';
    return (
      <LoginForm
        captchaUrl={this.captchaUrl}
        capTs={this.props.par}
        changeLoginStatus={this.changeLoginStatus}
        handleSubmit={this.handleSubmit}
        isLogin={isLogin}
        returnHome={this.returnHome}
        wrappedComponentRef={instance => this.loginForm = instance}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.login,
  };
}
export default connect(mapStateToProps, { ...loginActions, ...manageActions, ...frontActions, })(LoginPage);