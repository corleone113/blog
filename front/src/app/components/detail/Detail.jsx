import React, { PureComponent, } from 'react';
import { Breadcrumb, Icon, } from 'antd';
import remark from 'remark';
import { connect, } from 'react-redux';
import { actions, } from '@/reducers/frontReducer';
import remark2React from 'remark-react';
import style from './style.css';
const { get_article_detail, } = actions;

class Detail extends PureComponent {
  componentDidMount() {
    this.props.get_article_detail(this.props.location.state.id);
  }
  render() {
    const { articleContent, title, author, viewCount, time, history: { push, }, location: { state: { tag, }, }, } = this.props;
    return (
      <>
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {
            const path = tag === '首页' ? '/public' : `/public/${tag}`;
            push(path);
          }}><span style={{ cursor: 'pointer', fontWeight: 'bold', }}>{tag}</span></Breadcrumb.Item>
          <Breadcrumb.Item><span>正文</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className={style.container}>
          <h2>{title}</h2>
          <div className={style.articleInfo}>
            <span >
              <Icon type="user" />
              &nbsp;{author}
            </span>
            <span>
              <Icon type="calendar" />
              &nbsp;{time}
            </span>
            <span>
              <Icon type="eye" />
              &nbsp;{viewCount}
            </span>
          </div>
          <div className={style.content}
            id="preview"
          >
            {remark().use(remark2React).processSync(articleContent).contents}
          </div>
        </div>
      </>
    );
  }

}

function mapStateToProps(state) {
  const { content, title, author, viewCount, commentCount, time, } = state.front.articles.articleDetail;
  return {
    articleContent: content,
    title,
    author,
    viewCount,
    commentCount,
    time,
  };
}


export default connect(
  mapStateToProps,
  { get_article_detail, }
)(Detail);