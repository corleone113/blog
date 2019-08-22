import React, { Component, } from 'react';
import loadable from '@loadable/component';
import { connect, } from 'react-redux';
import style from './style.css';
import { Pagination, Breadcrumb, Button, Empty, } from 'antd';
import { actions, } from '@/reducers/manageReducer';
import { manager, } from '@/constants';

const entity = 'article';
const ArticleCell = loadable(()=>import('./components/ArticleCell'));
const ArticleEdit = loadable(()=>import('./articleEdit/ArticleEdit'));

class AdminManagerArticle extends Component {
    state = { isEdit: false, payload: null, recordNum: 1, }
    componentDidMount() {

        this.props.manage_get(entity, this.query());
    }
    query = () => {
        console.log('what is manager:', manager);
        return manager() === 'admin' ? {
            pageNum: this.state.recordNum,
        } : {
                pageNum: this.state.recordNum,
                author: manager(),
            };
    };
    hide_edit = () => {
        this.setState({ isEdit: false, payload: null, });
        this.props.manage_get(entity, this.query());
    };
    render() {
        const editPayload = { targetArticle: this.state.payload, };
        return (
            (<div className={style.topContainer}>
                <div style={{ margin: '1vw 0 0 1.5vw', }}>
                    {!this.state.isEdit && <Breadcrumb separator=">"><Breadcrumb.Item ><h2 >文章管理</h2></Breadcrumb.Item></Breadcrumb>}
                    {

                        this.state.isEdit && (
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item onClick={this.hide_edit}><h2 style={{ cursor: 'pointer', }}>文章管理</h2></Breadcrumb.Item>
                                <Breadcrumb.Item><h2>文章编辑/添加</h2></Breadcrumb.Item>
                            </Breadcrumb>
                        )
                    }
                </div>
                {
                    !this.state.isEdit ? (
                        <>
                            <div className={style.addButtonContainer}>
                                <Button type="warning" onClick={() => {
                                    this.setState({ isEdit: true, payload: null, });
                                }} className={style.buttonStyle}>添加文章</Button>
                            </div>
                            <div className={style.articleListContainer}>
                                {
                                    this.props.list.length === 0 ? <Empty /> :
                                        this.props.list.map((article) => (
                                            <ArticleCell
                                                edit_article={() => {
                                                    this.setState({ isEdit: true, payload: article, });
                                                }}
                                                history={this.props.history}
                                                delete={(id) => {
                                                    this.props.manage_delete(entity, null, id, this.query());
                                                }}
                                                key={article._id} data={article} />
                                        ))
                                }
                            </div>
                            <div className={style.paginationStyle}>
                                <Pagination
                                    defaultPageSize={5}
                                    onChange={(pageNum) => {
                                        this.props.manage_get(entity, { ...this.query(), pageNum, });
                                        this.setState({ recordNum: pageNum, });
                                    }}
                                    current={this.props.pageNum}
                                    total={this.props.total}
                                />
                            </div>
                        </>) : <ArticleEdit {...editPayload}
                            hide_edit={this.hide_edit} />}
            </div>)
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state.manage,
    };
}

export default connect(
    mapStateToProps,
    actions
)(AdminManagerArticle);

