import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { Switch, Route, } from 'react-router-dom';
import { bindActionCreators, } from 'redux';
import { actions, } from '../../reducers/tagReducer';
import Detail from '../../components/detail/Detail';
import Banner from '../../components/banner/Banner';
import Menus from '../../components/menu/Menus';
import Home from '../home/Home';
import NotFound from '../../components/notFound/NotFound';
import Toolbar from '../../components/toolbar/Toolbar';
import Loading from '../../components/loading/Loading';
import { actions as frontActions, } from '../../reducers/frontReducer';
import { actions as loginActions, } from '../../reducers/loginReducer';
import style from './style.css';
import { homeBannerImages as imgPaths, } from '../../config/config';
// import {homeBannerImages as imgPaths} from '../../../../config/config'

const { get_all_tags, } = actions;
const { get_article_list, } = frontActions;
const { goto_signin, goto_signup, } = loginActions;

// @connect(
//     mapStateToProps,
//     mapDispatchToProps
// )
// export default
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
    gotoPage = (f) => {
      return () => {
        f();
        this.props.history.push('login');
      };
    }
    render() {
      const { url, } = this.props.match;
      const toolbarPayload = {
        items: [{ title: '登录', todo: this.gotoPage(this.props.goto_signin), },
          { title: '注册', todo: this.gotoPage(this.props.goto_signup), }, ],
        history: this.props.history,
      };
      return (
        <>
          <div>
            <Toolbar {...toolbarPayload} />
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
                  <Route component={Home}
                    exact
                    path={url}
                  />
                  <Route component={Detail}
                    path={'/detail/:id'}
                  />
                  <Route component={Home}
                    path={'/:tag'}
                  />
                  <Route component={NotFound} />
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
    categories: state.admin.tags,
    userInfo: state.globalState.userInfo,
    isFetching: state.globalState.isFetching,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    get_all_tags: bindActionCreators(get_all_tags, dispatch),
    get_article_list: bindActionCreators(get_article_list, dispatch),
    goto_signin: bindActionCreators(goto_signin, dispatch),
    goto_signup: bindActionCreators(goto_signup, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Front);
