import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import style from './style.css';
import remark from 'remark';
import reactRenderer from 'remark-react';
import { Input, Select, Button, Modal, } from 'antd';
import { actions, } from '@/reducers/manageReducer';
import dateFormat from 'dateformat';

const { Option, } = Select;
const entity = 'article';

class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        const article = props.targetArticle;
        const initState = {
            options: [],
            modalVisible: false,
            content: '',
            title: '',
            tags: [],
            isCreate: true,
            article: null,
        };
        if (article) {
            const stateKeys = Object.keys(initState);
            const articleKeys = Object.keys(article);
            for (const key of articleKeys) {
                if (stateKeys.includes(key)) {
                    initState[key] = article[key];
                }
            }
            initState.isCreate = false;
            initState.article = article;
        }
        this.state = initState;
    }

    componentDidMount() {
        this.props.manage_get_all('tag', this.query);
    }
    getTagsBase=()=>{
        if(this.props.tags.length ===0){
            return [];
        }else {
            return this.props.tags.map((tag)=>tag.name);
        }
    }
    query = {
        creator: this.props.user,
    }
    //正文内容
    onChanges = (e) => {
        this.setState({ content: e.target.value, });
    }

    //标题输入框
    titleOnChange = (e) => {
        this.setState({ title: e.target.value, });
    };

    //选择标签
    selectTags = (value) => {
        this.setState({ tags: value, });
    };

    //预览
    preView = () => {
        this.setState({
            modalVisible: true,
        });
    };

    getRandom(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    }

    //发表
    saveOrPublish(publish) {
        const articleData = {
            title: this.state.title,
            content: this.state.content,
            tags: this.state.tags,
            time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
            isPublish: publish,
        };
        if (this.state.isCreate) {
            Object.assign(articleData, {
                viewCount: 0,
                commentCount: 0,
                author: this.props.user,
                coverImg: `/${this.getRandom(1, 11)}.jpg`,
            });
        }
        if (this.state.isCreate) {
            this.props.manage_create(entity, articleData);
        } else {
            const ids = [this.state.article._id, ];
            const sets = [articleData, ];
            this.props.manage_set(entity, { ids, sets, });
        }
        this.props.hide_edit();
    };

    //handleOk
    handleOk = () => {
        this.setState({
            modalVisible: false,
        });
    };

    render() {
        return (
            <>
                <div className={style.container}>
                    <span className={style.subTitle}>标题</span>
                    <Input
                        className={style.titleInput}
                        placeholder={'请输入文章标题'}
                        type="text"
                        value={this.state.title}
                        onChange={this.titleOnChange} />
                    <span className={style.subTitle}>正文</span>
                    <textarea
                        className={style.textArea}
                        value={this.state.content}
                        onChange={this.onChanges} />
                    <span className={style.subTitle}>分类</span>
                    <Select
                        mode="multiple"
                        className={style.titleInput}
                        placeholder="请选择分类"
                        onChange={this.selectTags}
                        value={this.state.tags}
                    >
                        {
                            this.getTagsBase().map((item) => (
                                <Option key={item}>{item}</Option>
                            ))
                        }
                    </Select>

                    <div className={style.bottomContainer}>
                        <Button type="warning" onClick={() => this.saveOrPublish(true)}
                            className={style.buttonStyle}>发布</Button>
                        <Button type="warning" onClick={() => this.saveOrPublish(false)}
                            className={style.buttonStyle}>存为草稿</Button>
                        <Button type="warning" onClick={this.preView}
                            className={style.buttonStyle}>预览</Button>
                        <Button type="warning" onClick={this.props.hide_edit}
                            className={style.buttonStyle}>取消</Button>
                    </div>
                </div>
                <Modal
                    visible={this.state.modalVisible}
                    title="文章预览"
                    onOk={this.handleOk}
                    width={'900px'}
                    onCancel={this.handleOk}
                    footer={null}
                >
                    <div className={style.modalContainer}>
                        <div id="preview" className={style.testCode}>
                            {remark().use(reactRenderer).processSync(this.state.content).contents}
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        tags: state.manage.tags,
    };
}

export default connect(
    mapStateToProps,
    actions,
)(ArticleEdit);