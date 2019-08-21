import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import { Card, Table, Button, Modal, Form, Input, Popconfirm, } from 'antd';
import { actions as manageActions, } from '@/reducers/manageReducer';

const entity = 'tag';
const relative = 'article';
class Role extends Component {
    componentDidMount() {
        this.props.manage_change({selectedRows:[], selectedRowKeys:[], });
        this.props.manage_get(entity, this.query());
    }
    query = ()=> ({
        creator: JSON.parse(sessionStorage.getItem('info')).username,
        pageNum: 1,
    });
    onAdd = () => {
        this.props.manage_change({ editVisible: true, });
    }
    onAddCancel = () => {
        this.props.manage_change({ editVisible: false, });
    }
    onAddOk = () => {
        const values = this.editForm.props.form.getFieldsValue();
        if (!values.name) {
            this.props.manage_error('名称不能为空!');
            this.props.manage_change({ editVisible: false, });
        }
        const tag = { name: values.name, creator: this.query().creator, };
        this.props.manage_create(entity, tag, this.query());
    }
    getSets = (query, article) => {
        const result = {};
        for (const key of Object.keys(query)) {
            if (article.hasOwnProperty(key)) {
                const arr = article[key].filter(item => item !== query[key]);
                result[key] = arr;// result是有必要的，如果是 query[key]=arr并返回query后续再调用这个方法时将不能产生过滤作用，因为过滤条件query已经改变并失效了。
            }
        }
        return result;
    }
    onDel = (record) => {
        this.props.manage_relative_delete(entity, relative, [{ tags: record.name, }, ], this.getSets, record._id, null, this.query());
    }
    onDelAll = () => {
        const querys = [];
        for (const tag of this.props.selectedRows) {
            querys.push({ tags: tag.name, });
        }
        // this.props.manage_get_all('article', querys);
        this.props.manage_relative_delete(entity, relative, querys, this.getSets, '', { ids: this.props.selectedRowKeys, }, this.query());
    }
    onSearch = () => {
        const values = this.searchForm.props.form.getFieldsValue();
        const where = Object.keys(values).reduce((memo, key) => {
            if (values[key]) {
                memo[key] = values[key];
            }
            return memo;
        }, {});
        this.props.manage_get(entity, { ...this.query(), ...where, });
    }
    onCheck = (checkedKeys) => {
        this.props.manage_change({ checkedKeys, });
    }
    render() {
        const columns = [
            {
                title: '标签名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'operation',
                render: (val, record) => {
                    return (
                        <>
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                title="请问你确认要删除此标签吗(对应的文章会失去此标签)?"
                                onConfirm={() => this.onDel(record)}
                            >
                                <Button style={{ marginLeft: 10, }} type="danger">删除</Button>
                            </Popconfirm>
                        </>
                    );
                },
            },
        ];
        const { list, pageNum, pageSize, total, isFetching, editVisible, record, selectedRowKeys, } = this.props;
        // const filteredList=list.filter(role=>role.name!=='管理员');
        const pagination = {
            current: pageNum,
            pageSize: pageSize,
            total,
            showQuickJumper: true,
            showTotal: (total) => {
                return `共计${total}条`;
            },
            onChange: (pageNum) => {
                this.props.manage_get(entity, { ...this.query(), pageNum, });
                this.props.manage_change({ selectedRowKeys: [], selectedRows: [], pageNum, });
            },
        };
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.manage_change({ selectedRowKeys, selectedRows, });
            },
        };
        const onRow = (record) => {
            return {
                onClick: () => {
                    const { selectedRowKeys, } = this.props;
                    const { selectedRows, } = this.props;
                    const index = selectedRowKeys.indexOf(record._id);
                    if (index === -1) {
                        this.props.manage_change({
                            selectedRowKeys: [...selectedRowKeys, record._id, ],
                            selectedRows: [...selectedRows, record, ],
                        });
                    } else {
                        this.props.manage_change({
                            selectedRowKeys: [...selectedRowKeys.slice(0, index), ...selectedRowKeys.slice(index + 1), ],
                            selectedRows: [...selectedRows.slice(0, index), ...selectedRows.slice(index + 1), ],
                        });
                    }

                },
            };
        };
        const cantDeleteMultiple = this.props.selectedRowKeys.length === 0;
        return (
            <>
                <Card>
                    <SearchForm
                        // where={where}
                        onSearch={this.onSearch}
                        wrappedComponentRef={inst => this.searchForm = inst}
                    />
                </Card>
                <Card>
                    <Button.Group>
                        <Button type="warning" onClick={this.onAdd}>增加</Button>
                        <Popconfirm
                            okText="确认"
                            cancelText="取消"
                            title="请问你确认要删除以下标签吗(对应的文章会失去此标签)?"
                            onConfirm={this.onDelAll}
                        >
                            <Button style={{ marginLeft: '10px', }} type="danger" disabled={cantDeleteMultiple}>删除多条</Button>
                        </Popconfirm>
                    </Button.Group>
                    <Table
                        columns={columns}
                        dataSource={list}
                        pagination={pagination}
                        loading={isFetching}
                        rowKey={row => row._id}
                        rowSelection={rowSelection}
                        onRow={onRow}
                    />
                    <EditModal
                        visible={editVisible}
                        onOk={this.onAddOk}
                        onCancel={this.onAddCancel}
                        record={record}
                        wrappedComponentRef={inst => this.editForm = inst}
                    />
                </Card>
            </>
        );
    }
}

@Form.create()
class SearchForm extends React.Component {
    render() {
        const { form: { getFieldDecorator, }, onSearch, } = this.props;
        return (
            <Form layout="inline">
                <Form.Item label="标签名称">
                    {getFieldDecorator('name', {
                        initialValue: '',
                    })(
                        <Input onPressEnter={onSearch} />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button onClick={onSearch} shape="circle" icon="search" />
                </Form.Item>
            </Form>
        );
    }
}


@Form.create()
class EditModal extends React.Component {
    render() {
        const { visible, onOk, onCancel, form: { getFieldDecorator, }, } = this.props;
        return (
            <Modal
                title="添加标签"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Form>

                    <Form.Item label="标签名称">
                        {getFieldDecorator('name')(
                            <Input onPressEnter={onOk} autoFocus />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
function mapStateToProps(state) {
    return {
        // userInfo: state.manage.userInfo,
        ...state.manage,
        isFetching: state.globalState.isFetching,
    };
}

export default connect(mapStateToProps, manageActions)(Role);