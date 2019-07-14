import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import remark from 'remark'
import { connect } from 'react-redux'
import { actions } from "../../reducers/frontReducer";
import remark2React from 'remark-react'
import style from './style.css'
const { get_article_detail } = actions;

class Detail extends PureComponent {
    render() {
        const { articleContent, title, author, viewCount, commentCount, time } = this.props;
        return (
            <div className={style.container}>
                <h2>{title}</h2>
                <div className={style.articleInfo}>
                    <span >
                        <img className={style.authorImg} src={require('./author.png')} /> {author}
                    </span>
                    <span>
                        <img src={require('./calendar.png')} /> {time}
                    </span>
                    <span>
                        <img src={require('./comments.png')} /> {commentCount}
                    </span>
                    <span>
                        <img src={require('./views.png')} /> {viewCount}
                    </span>
                </div>
                <div id='preview' className={style.content}>
                    {remark().use(remark2React).processSync(articleContent).contents}
                </div>
                <button onClick={this.tmpClick}>测试</button>
            </div>
        )
    }

    componentDidMount() {
        // console.log('did mount props:', this.props)
        this.props.get_article_detail(this.props.location.state.id);
    }
}

function mapStateToProps(state) {
    const { content, title, author, viewCount, commentCount, time } = state.front.articleDetail;
    return {
        articleContent: content,
        title,
        author,
        viewCount,
        commentCount,
        time
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_article_detail: bindActionCreators(get_article_detail, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);