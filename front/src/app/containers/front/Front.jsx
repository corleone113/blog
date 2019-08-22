import React, { Component, } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { Switch, Route, } from 'react-router-dom';
import { actions as frontActions, } from '@/reducers/frontReducer';
import { actions as loginActions, } from '@/reducers/loginReducer';
import { actions as manageActions, } from '@/reducers/manageReducer';
import style from './style.css';
import { homeBannerImages as imgPaths, } from '@/constants';
const { manage_logout, manage_provide, } = manageActions;
const Home = loadable(() => import('../home/Home'));
const Detail = loadable(() => import('@/components/detail/Detail'));
const Banner = loadable(() => import('@/components/banner/Banner'));
const Menus = loadable(() => import('@/components/menu/Menus'));
const Loading = loadable(() => import('@/components/loading/Loading'));
const Toolbar = loadable(() => import('@/components/toolbar/Toolbar'));

class Front extends Component {
  static defaultProps = {
    categories: [],
  };
  static propTypes = {
    categories: PropTypes.array.isRequired,
  }
  state = { userInfo: JSON.parse(sessionStorage.getItem('info')), };
  componentDidMount() {
    this.props.get_all_tags();
    this.props.manage_provide(this.logout);
  }
  gotoLoginPage = (f) => {
    return () => {
      f();
      this.props.history.push('/login');
    };
  }
  gotoManagePage = () => {
    this.props.history.push('/admin/manage');
  }
  logout = () => {
    sessionStorage.clear();
    this.setState({ userInfo: null, });
  }
  render() {
    const payloadBeforeSignIn = {
      items: [{ title: '登录', todo: this.gotoLoginPage(this.props.goto_signin), },
      { title: '注册', todo: this.gotoLoginPage(this.props.goto_signup), }, ],
      title: '登录/注册',
    };
    const payloadAfterSignIn = {
      items: [{ title: '管理', todo: this.gotoManagePage, },
      { title: '退出', todo: this.props.manage_logout, }, ],
      title: `欢迎, ${this.state.userInfo && (this.state.userInfo.username)}`,
    };
    const toolBarPayload = this.state.userInfo ? payloadAfterSignIn : payloadBeforeSignIn;
    return (
      <>
        <div>
          <div className={style.container_toolbar}>
            <Toolbar {...toolBarPayload} />
          </div>
          <Banner imagePaths={imgPaths} />
          <Menus categories={this.props.categories}
            getArticleList={(tag) => this.props.get_article_list(tag, 1)}
            history={this.props.history}
          />
        </div>
        {this.props.isFetching && <Loading />}
        <div className={style.container}>
          <div className={style.contentContainer}>
            <div className={style.content}>
              <Switch>
                <Route component={Detail}
                  path="/public/detail/:id"
                />
                <Route component={Home} exact
                  path="/public/:tag"
                />
                <Route component={Home} path="/public" />
              </Switch>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.front.tags,
    userInfo: state.globalState.userInfo,
    isFetching: state.globalState.isFetching,
  };
}

export default connect(
  mapStateToProps,
  {
    ...frontActions,
    ...loginActions,
    manage_logout,
    manage_provide,
  }
)(Front);
