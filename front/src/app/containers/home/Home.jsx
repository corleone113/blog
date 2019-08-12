import React, { PureComponent, } from 'react';
import { Redirect, } from 'react-router-dom';
import { Pagination, } from 'antd';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';
import { actions as frontActions, } from '../../reducers/frontReducer';
import ArticleList from '../../components/article/Articles';
import PropTypes from 'prop-types';
import style from './style.css';

const { get_article_list, get_article_detail, } = frontActions;
class Home extends PureComponent {
  static defaultProps = {
    userInfo: {},
    pageNum: 1,
    total: 0,
    articleList: [],
  };
  static propsTypes = {
    pageNum: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    articleList: PropTypes.array.isRequired,
  };
  constructor() {
    super();
  }
  componentDidMount() {
    this.props.get_article_list(this.props.match.params.tag || '');
  }
  render() {
    const { tags, } = this.props;
    localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
    return (
      tags.length > 1 && this.props.match.params.tag && (tags.indexOf(this.props.match.params.tag) === -1 || this.props.location.pathname.lastIndexOf('/') > 0) ? <Redirect to="/404" /> :
        <div className={style.container}>
          <ArticleList
            data={this.props.articleList}
            getArticleDetail={this.props.get_article_detail}
            history={this.props.history}
          />
          <div className={style.paginationContainer}>
            <Pagination
              current={this.props.pageNum}
              defaultPageSize={5}
              onChange={(pageNum) => {
                this.props.get_article_list(this.props.match.params.tag || '', pageNum);
              }}
              total={this.props.total}
            />
          </div>
        </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tags: state.admin.tags,
    pageNum: state.front.pageNum,
    total: state.front.total,
    articleList: state.front.articleList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_article_list: bindActionCreators(get_article_list, dispatch),
    get_article_detail: bindActionCreators(get_article_detail, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);