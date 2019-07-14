import React, { PureComponent } from 'react';
import style from './style.css';

export const ArticleListCell = (props) => (
    // <div className={`${style.container} `} onClick={() => {
    //     props.history.push(`/detail/${props.data._id}`, { id: props.data._id }); props.getArticleDetail(props.data._id)
    // }}>
    <div className={`${style.container} `} onClick={() => {
        props.history.push(`/detail/${props.data._id}`, { id: props.data._id });
    }}>
        <div>
            <img src={props.data.coverImg} alt="" />
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
                        <img src={require('./calendar.png')} alt="发表日期" />
                        {props.data.time}
                    </span>
                    <span>
                        <img src={require('./views.png')} alt="阅读数" />
                        {props.data.viewCount}
                    </span>
                    <span>
                        <img src={require('./comments.png')} alt="评论数" />
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
                    this.props.data.map((item, index) => (
                        <ArticleListCell getArticleDetail={this.props.getArticleDetail} history={this.props.history} key={index} data={item} />
                    ))
                }
            </div>
        )
    }
}