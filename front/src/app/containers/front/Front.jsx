import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { Switch, Route, } from 'react-router-dom';
import Detail from '../../components/detail/Detail';
import Banner from '../../components/banner/Banner';
import Menus from '../../components/menu/Menus';
import Home from '../home/Home';
import Toolbar from '../../components/toolbar/Toolbar';
import Loading from '../../components/loading/Loading';
import { actions as frontActions, } from '../../reducers/frontReducer';
import { actions as loginActions, } from '../../reducers/loginReducer';
import style from './style.css';
import { homeBannerImages as imgPaths, } from '../../config/config';
// import {homeBannerImages as imgPaths} from '../../../../config/config'

class Front extends Component {
  static defaultProps = {
    categories: [],
  };
  static propTypes = {
    categories: PropTypes.array.isRequired,
  }

  componentDidMount() {
    this.props.get_all_tags();
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
  render() {
    const toolbarPayload = {
      items: [{ title: '登录', todo: this.gotoLoginPage(this.props.goto_signin), },
      { title: '注册', todo: this.gotoLoginPage(this.props.goto_signup), }, ],
      title: '登录/注册',
    };
    return (
      <>
        <div>
          <div className={style.container_toolbar}>
            <span onClick={this.gotoManagePage}>管理</span>
            <Toolbar {...toolbarPayload} />
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
  }
)(Front);
