import React, { Component, } from 'react';
import { Pagination, } from 'antd';
import { connect, } from 'react-redux';
import { actions as frontActions, } from '@/reducers/frontReducer';
import PropTypes from 'prop-types';
import style from './style.css';
import ArticleList from '@/components/article/Articles';


class Home extends Component {
  static defaultProps = {
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
    if (this.props.articleList.length === 0)
      this.props.get_article_list(this.props.match.params.tag || '');
  }
  render() {
    const { tags, } = this.props;
    const path = this.props.location.pathname;
    const current_tag = path.split('/')[2];
    const tag= current_tag === undefined ? '首页' : current_tag;
    const isTag = tags.includes(tag) || path === '/public';
    return (
      <>
        {
          isTag &&
          (< div className={style.container} >
            <ArticleList
              data={this.props.articleList}
              history={this.props.history}
              tag={tag}
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
    tags: props.tags.list,
    pageNum: props.articles.pageNum,
    total: props.articles.total,
    articleList: props.articles.articleList,
  };
}

export default connect(
  mapStateToProps,
  frontActions
)(Home);