import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import { Switch, } from 'react-router-dom';
import { Layout, } from 'antd';
import ManageHeader from './ManageHeader';
import NavList from './NavList';
import { actions, } from '../../reducers/manageReducer';
// import Loading from '../../components/loading/Loading';
import routeConfig from './routeConfig';
import RouteGuard from './RouteGuard';
// import Role from '../role/Role';
// import User from '../user/User';
import style from './style.css';

const { Sider, Content, } = Layout;

class Manage extends Component {
    componentDidMount() {
        // 向saga state提供登出方法
        this.props.manage_provide(this.logout);
    }

    manage_error = (msg) => {
        this.props.manage_error(msg);
    }
    //登录方法，已绑定this
    logout = () => {
        const {
            location: { pathname, },
            history,
        } = this.props;
        sessionStorage.clear();
        // 在浏览器url不为/login时才重定向，避免管理页面发起多个请求时因会话过期而多次重定向到login页面
        pathname !== '/login' && history.push('/login');
    }
    render() {
        const userInfo = JSON.parse(sessionStorage.getItem('info'));
        return (<>
            {/* {this.props.isFetching && <Loading />} */}
            <Layout>
                <ManageHeader {...{ ...this.props, userInfo, }} />
                <Layout className={style.layout}>
                    <Sider>
                        <NavList {...{ ...this.props, userInfo, }} />
                    </Sider>
                    <Content>
                        <Switch>
                            {/* <Route path="/admin/manage/user" component={User} exact />
                            <Route path="/admin/manage/role" component={Role} exact /> */}
                            <RouteGuard routes={routeConfig} location={this.props.location} userInfo={userInfo} manage_error={this.manage_error} logout={this.logout} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </>);
    }
}

function mapStateToProps(state) {
    return {
        manage:state.manage,
    };
}

export default connect(mapStateToProps, actions)(Manage);