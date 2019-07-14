import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Tabs } from 'antd';
import { actions as loginActions } from '../../reducers/loginReducer'
// import { HashRouter, Link, Route } from 'react-router-dom';
import Banner from '../../components/banner/Banner';
import LoginForm from './LoginForm';
import style from './style.css';
import { loginBannerImages as imgPaths } from '@/config/config';
// import NotFound from '../../components/notFound/NotFound';

const { TabPane } = Tabs;
const { goto_signin, goto_signup, signup } = loginActions

class LoginPage extends Component {

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Yes!!${this.props.to}`)
        //thisis.loginForm.props.form.getFeildsValue is not a function

        const values = this.loginForm.props.form.getFieldsValue();
        this.props.isLogin?null:this.props.signup(values);
        // this.props.dispatch({
        //             type:this.props.isLogin?"login/signin":'login/signup',
        //             payload:values
        //  });
    }
    changeTab = (key) => {
        this.props[key]();
    }
    changeLoginStatus = () => {
        const key = this.props.to == 'goto_signin' ? 'goto_signup' : 'goto_signin';
        this.props[key]();
    }
    returnHome = () => {
        this.props.history.push('/');
    }
    render() {
        const isLogin = this.props.to === 'goto_signin';
        return (
            <>
                <div className={style.tab_container}>
                    <Tabs defaultActiveKey={this.props.to} onChange={this.changeTab} size='large' tabPosition='right'>
                        <TabPane tab="登录" key="goto_signin">
                            {/* 登录 */}
                            {isLogin && <LoginForm
                                wrappedComponentRef={instance => this.loginForm = instance}
                                handleSubmit={this.handleSubmit}
                                isLogin={isLogin}
                                changeLoginStatus={this.changeLoginStatus}
                                returnHome={this.returnHome}
                            />}
                        </TabPane>
                        <TabPane tab="注册" key="goto_signup">
                            {/* 注册 */}
                            <LoginForm
                                wrappedComponentRef={instance => this.loginForm = instance}
                                handleSubmit={this.handleSubmit}
                                isLogin={isLogin}
                                changeLoginStatus={this.changeLoginStatus}
                                returnHome={this.returnHome}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                <Banner imagePaths={imgPaths} size={{ height: '95vh' }} />
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        ...state.admin.login
    }
}
function mapDispatchToProps(dispatch) {
    return {
        goto_signin: bindActionCreators(goto_signin, dispatch),
        goto_signup: bindActionCreators(goto_signup, dispatch),
        signup: bindActionCreators(signup, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);