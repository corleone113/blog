import React, { PureComponent, } from 'react';
import style from './style.css';

export const ArticleListCell = ( props ) => (
  // <div className={`${style.container} `} onClick={() => {
  //     props.history.push(`/detail/${props.data._id}`, { id: props.data._id }); props.getArticleDetail(props.data._id)
  // }}>
  <div className={`${style.container} `}
    onClick={() => {
      props.history.push( `/detail/${props.data._id}`, { id: props.data._id, } );
    }}
  >
    <div>
      <img alt=""
        src={props.data.coverImg}
      />
    </div>
    <div className={style.bottomContainer}>
      <p className={style.title}>
        {props.data.title}
      </p>
      <p className={style.summary}>
                这里应该有摘要的，因为设计的数据库表表结构的时候忘记了，后面也是懒得加了，感觉太麻烦了，就算了
      </p>
      <div>
        <p>
          <span>
            <img alt="发表日期"
              src={require( './calendar.png' )}
            />
            {props.data.time}
          </span>
          <span>
            <img alt="阅读数"
              src={require( './views.png' )}
            />
            {props.data.viewCount}
          </span>
          <span>
            <img alt="评论数"
              src={require( './comments.png' )}
            />
            {props.data.commentCount}
          </span>
        </p>
        <span className={style.lastSpan}>
                    阅读全文 <span>》</span>
        </span>
      </div>
    </div>
  </div>
);

export default class extends PureComponent {
  render() {
    return (
      <div>
        {
          this.props.data.map( ( item, index ) => (
            <ArticleListCell data={item}
              getArticleDetail={this.props.getArticleDetail}
              history={this.props.history}
              key={index}
            />
          ) )
        }
      </div>
    );
  }
}