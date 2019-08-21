import React, { PureComponent, } from 'react';
import { connect, } from 'react-redux';
import { actions as loginActions, } from '@/reducers/loginReducer';
import Banner from '@/components/banner/Banner';
import LoginForm from './LoginForm';
import { loginBannerImages as imgPaths, } from '@/config/config';

const captchaUrl = 'http://localhost:2333/admin/captcha';

class LoginPage extends PureComponent {
  constructor() {
    super();
  }
  componentDidMount() {
    this.getExtraH();
    this.props.provide_api(this.afterLogin);
  }
  componentDidUpdate() {
    this.getExtraH();
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
  getExtraH = () => {
    const frm = document.getElementsByTagName('form')[0];
    this.extraH = getComputedStyle(frm).marginTop;
  }
  render() {
    this.captchaUrl = captchaUrl + '?ts=' + Date.now();
    const isLogin = this.props.to === 'goto_signin';
    const extraH = isLogin ? '0px' : parseFloat(this.extraH) * 2 + 'px';
    return (
      <>
        <LoginForm
          captchaUrl={this.captchaUrl}
          capTs={this.props.par}
          changeLoginStatus={this.changeLoginStatus}
          handleSubmit={this.handleSubmit}
          isLogin={isLogin}
          returnHome={this.returnHome}
          wrappedComponentRef={instance => this.loginForm = instance}
        />
        <Banner imagePaths={imgPaths}
          size={{ height: `calc(100vh + ${extraH})`, minHeight: '940px', }}
        />
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.login,
  };
}
export default connect(mapStateToProps, loginActions)(LoginPage);