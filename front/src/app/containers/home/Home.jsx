import React, { PureComponent, } from 'react';
import { Pagination, } from 'antd';
import { connect, } from 'react-redux';
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
    const m = this.props.match;
    const isTag = tags.includes(m.params.tag) || m.url === '/public';
    return (
      <>
        {
          isTag &&
          (< div className={style.container} >
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
          </div >)}
      </>
    );
  }
}
function mapStateToProps(state) {
  const props = state.front;
  return {
    tags: props.tags,
    pageNum: props.articles.pageNum,
    total: props.articles.total,
    articleList: props.articles.articleList,
  };
}

export default connect(
  mapStateToProps,
  { get_article_detail, get_article_list, }
)(Home);