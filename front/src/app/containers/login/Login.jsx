import React, { PureComponent, } from 'react';
import loadable from '@loadable/component';
import { connect, } from 'react-redux';
import { actions as loginActions, } from '@/reducers/loginReducer';

const captchaUrl = 'http://localhost:2333/admin/captcha';
const LoginForm = loadable(() => import('./LoginForm'));

class LoginPage extends PureComponent {
  constructor() {
    super();
    console.log('the LoginForm:', <LoginForm />);
  }
  componentDidMount() {
    this.props.provide_api(this.afterLogin);
  }
  afterLogin = (userInfo) => {
    sessionStorage.setItem('info', JSON.stringify(userInfo));
    this.props.history.push('/');
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
export default connect(mapStateToProps, loginActions)(LoginPage);