import React, { PureComponent, } from 'react';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { actions as loginActions, } from '../../reducers/loginReducer';
// import { HashRouter, Link, Route } from 'react-router-dom';
import Banner from '../../components/banner/Banner';
import LoginForm from './LoginForm';
import { loginBannerImages as imgPaths, } from '@/config/config';
// import NotFound from '../../components/notFound/NotFound';
const { goto_signin, goto_signup, signup, } = loginActions;

class LoginPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      extraH: '0px',
    };
  }
  componentDidMount() {
    this.getExtraH();
  }
  componentDidUpdate() {
    this.getExtraH();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Yes!!${this.props.to}`)
    //thisis.loginForm.props.form.getFeildsValue is not a function

    const values = this.loginForm.props.form.getFieldsValue();
    this.props.isLogin ? null : this.props.signup(values);
    // this.props.dispatch({
    //             type:this.props.isLogin?"login/signin":'login/signup',
    //             payload:values
    //  });
  }
  changeTab = (key) => {
    console.log('call the changetab...');
    this.props[key]();
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
    this.setState({ extraH: getComputedStyle(frm).marginTop, });
  }
  render() {
    const isLogin = this.props.to === 'goto_signin';
    const h = isLogin ? '0px' : parseFloat(this.state.extraH) * 2 + 'px';
    return (
      <>
        <LoginForm
          capTs={this.props.par}
          changeLoginStatus={this.changeLoginStatus}
          handleSubmit={this.handleSubmit}
          isLogin={isLogin}
          returnHome={this.returnHome}
          wrappedComponentRef={instance => this.loginForm = instance}
        />
        <Banner imagePaths={imgPaths}
          size={{ height: `calc(100vh + ${h})`, }}
        />
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.admin.login,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    goto_signin: bindActionCreators(goto_signin, dispatch),
    goto_signup: bindActionCreators(goto_signup, dispatch),
    signup: bindActionCreators(signup, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);