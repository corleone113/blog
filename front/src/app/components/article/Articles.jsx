import React, { PureComponent, } from 'react';
import {Icon, } from 'antd';
import style from './style.css';

export const ArticleListCell = (props) => (
  <div className={`${style.container} `}
    onClick={() => {
      props.history.push(`/public/detail/${props.data._id}`, { id: props.data._id, });
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
        这里应该有摘要的，不过暂时没想好以怎样的形式展示，所以数据表中暂时没有加上，后续想到了再补上！
      </p>
      <div>
        <p>
          <span>
            <Icon type="canlender" />
            &nbsp;{props.data.time}
          </span>
          <span>
            <Icon type="eye" />
            &nbsp;{props.data.viewCount}
          </span>
          <span>
            <Icon type="message" />
            &nbsp;{props.data.commentCount}
          </span>
          <span>
            <Icon type="user" />
            &nbsp;{props.data.author}
          </span>
        </p>
        <span className={style.lastSpan}>
          阅读全文 <span>></span>
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
          this.props.data.map((item, index) => (
            <ArticleListCell data={item}
              history={this.props.history}
              key={index}
            />
          ))
        }
      </div>
    );
  }
}