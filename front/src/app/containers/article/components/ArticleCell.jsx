import style from '../style.css';
import React from 'react';
import { Button, Popconfirm, } from 'antd';
export const ArticleCell = (props) => (
    <div className={style.cellContainer}>
        <div className={style.cellAboutArticle}>
            <p className={style.articleTitle}>{props.data.title}</p>
            <p className={style.articleInfo}>
                <span>作者:{props.data.author}</span>
                <span>阅读数:{props.data.viewCount}</span>
                <span>评论数:{props.data.commentCount}</span>
                <span>发表时间:{props.data.time}</span>
            </p>
        </div>
        <div className={style.cellState}>
            <span>
                {props.data.isPublish ? '已发布' : '草稿'}
            </span>
        </div>
        <div className={style.cellOperation}>
            <Button type="warning" icon="edit" onClick={() => { props.edit_article(); }}>编辑</Button>
            <Popconfirm
                okText="确认"
                cancelText="取消"
                title="请问你确认要删除此文章吗?"
                onConfirm={() => props.delete(props.data._id)}
            >
                <Button type="danger" icon="delete">删除</Button>
            </Popconfirm>
            <Button type="warning" icon="eye-o" onClick={() => { props.history.push(`/public/detail/${props.data._id}`, { id: props.data._id, }); }} >查看</Button>
        </div>
    </div>
);