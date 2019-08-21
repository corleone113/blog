import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import { Card, Table, Button, Modal, Form, Input, Popconfirm, Tree, } from 'antd';
import { actions as manageActions, } from '@/reducers/manageReducer';
import style from './style.css';
import { excludeResources, } from '@/config/config';

const { TreeNode, } = Tree;
const entity = 'role';
const relative = 'user';

class Role extends Component {
    componentDidMount() {
        this.props.manage_change({ selectedRows: [], selectedRowKeys: [], });
        this.props.manage_get(entity, this.query());
        this.props.manage_get_all('resource');
    }
    query = () => ({ pageNum: 1, name: JSON.stringify({ $ne: '系统管理员', }), });
    onAdd = () => {
        this.props.manage_change({ editVisible: true, isCreate: true, });
    }
    onEditCancel = () => {
        this.props.manage_change({ editVisible: false, });
    }
    onEditOk = () => {
        const values = this.editForm.props.form.getFieldsValue();
        if (!values.name) {
            this.props.manage_error('名称不能为空!');
            this.props.manage_change({ editVisible: false, });
        }
        const ids = [values.id, ];
        const sets = [{ name: values.name, }, ];
        this.props.isCreate ? this.props.manage_create(entity, values, this.query()) : this.props.manage_set(entity, { ids, sets, }, this.query());
    }
    onEdit = (record) => {
        this.props.manage_change({ editVisible: true, record, isCreate: false, });
    }
    getSets = () => {
        return { role: '', };
    }
    onDel = (record) => {
        this.props.manage_relative_delete(entity, relative, [{ role: record.name, }, ], this.getSets, record._id, null, this.query());
    }
    onDelAll = () => {
        console.log('the selectedKeys:', this.props.selectedRowKeys);
        const querys = [];
        for (const role of this.props.selectedRows) {
            querys.push({ role: role.name, });
        }
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
        const finalQuery = { ...this.query(), ...where, };
        if (finalQuery.name && Object.keys(where).length > 0) {
            finalQuery.name = JSON.stringify(finalQuery.name);
            console.log('Role query:', finalQuery);
        }
        if (finalQuery.name === '"系统管理员"') {
            delete finalQuery.name;
            finalQuery.errorCondition = '';
        }
        this.props.manage_get(entity, finalQuery);
    }
    setRoleResource = () => {//给角色授与资源
        const { selectedRowKeys, } = this.props;
        if (selectedRowKeys.length === 1) {
            const record = this.props.selectedRows[0];
            const resourceKeys = Array.from(record.resources);
            for (const exclude of excludeResources) {
                if (resourceKeys.includes(exclude))
                    resourceKeys.splice(resourceKeys.indexOf(exclude), 1);
            }
            this.props.manage_change({ checkedKeys: resourceKeys, });
            this.props.manage_change({ record, resourceVisible: true, });
        } else if (selectedRowKeys.length > 1) {
            this.props.manage_error('不能同时为多个角色分配资源!');
        } else {
            this.props.manage_error('请至少选择一个角色!');
        }
    }
    onCheck = (checkedKeys) => {
        this.props.manage_change({ checkedKeys, });
    }
    setRoleResourceCancel = () => {
        this.props.manage_change({ resourceVisible: false, });
    }
    setRoleResourceOk = () => {
        const getResourceParent = (keys, resources) => {
            console.log('the array:', keys, resources);
            let neededKeys = [];
            for (const key of keys) {
                for (const resource of resources) {
                    if (resource.name === key && resource.parent !== '' && !keys.includes(resource.parent))
                        neededKeys.push(resource.parent);
                    if (resource.children.length > 0) {
                        neededKeys = neededKeys.concat(getResourceParent(keys, resource.children));
                    }
                }
            }
            return neededKeys;
        };
        const finalKeys = getResourceParent(this.props.checkedKeys, this.props.resources).concat(this.props.checkedKeys);
        console.log('the final keys:', finalKeys);
        const ids = [this.props.record._id, ];
        const sets = [{ resources: finalKeys, }, ];
        // console.log('role resource ids and sets', ids, sets);
        this.props.manage_set(entity, { ids, sets, }, this.query());
    }
    render() {
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                className: style.min_name_width,
            },
            {
                title: '操作',
                key: 'operation',
                render: (val, record) => {
                    return (
                        <>
                            <Button type="warning" onClick={(e) => { e.target.blur(); this.onEdit(record); }}>编辑</Button>
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                title="请问你确认要删除此角色吗(对应用户会失去角色)?"
                                onConfirm={() => this.onDel(record)}
                            >
                                <Button style={{ marginLeft: 10, }} type="danger">删除</Button>
                            </Popconfirm>
                        </>
                    );
                },
            },
        ];
        const { list, pageNum, pageSize, isFetching, editVisible, record, isCreate, selectedRowKeys, resourceVisible, checkedKeys, resources, } = this.props;
        const filteredList = list.filter(role => role.name !== '系统管理员');
        const pagination = {
            current: pageNum,
            pageSize: pageSize,
            total: filteredList.length,
            showQuickJumper: true,
            showTotal: (total) => {
                return `共计${total}条`;
            },
            onChange: (pageNum) => {
                this.props.manage_change({ selectedRowKeys: [], selectedRows: [], pageNum, });
                this.props.manage_get(entity, { ...this.query(), pageNum, });
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
                            title="请问你确认要删除以下角色吗(对应用户会失去角色)?"
                            onConfirm={this.onDelAll}
                        >
                            <Button style={{ marginLeft: '10px', }} type="danger" disabled={cantDeleteMultiple}>删除多条</Button>
                        </Popconfirm>
                        <Button style={{ marginLeft: '10px', }} type="warning" onClick={this.setRoleResource}>资源分配</Button>
                    </Button.Group>
                    <Table
                        className={style.min_name_width}
                        columns={columns}
                        dataSource={filteredList}
                        pagination={pagination}
                        loading={isFetching}
                        rowKey={row => row._id}
                        rowSelection={rowSelection}
                        onRow={onRow}
                    />
                    <EditModal
                        visible={editVisible}
                        onOk={this.onEditOk}
                        onCancel={this.onEditCancel}
                        record={record}
                        wrappedComponentRef={inst => this.editForm = inst}
                        isCreate={isCreate}
                    />
                    <ResourceModal
                        visible={resourceVisible}
                        onOk={this.setRoleResourceOk}
                        onCancel={this.setRoleResourceCancel}
                        record={record}
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                        resources={resources}
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
                <Form.Item label="角色名称">
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

class ResourceModal extends React.Component {
    renderTree = (resources) => {
        return resources.map(resource => {
            const shouldDisable = resource.name === '权限管理' || resource.parent === '权限管理';
            if (resource.children.length > 0) {
                return (
                    <TreeNode title={resource.name} key={resource.name} disabled={shouldDisable}>
                        {this.renderTree(resource.children)}
                    </TreeNode>
                );
            } else {
                return <TreeNode title={resource.name} key={resource.name} disabled={shouldDisable} />;
            }
        });
    }
    render() {
        const { visible, onOk, onCancel, onCheck, checkedKeys, resources, } = this.props;
        return (
            <Modal
                title="设置权限"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                >
                    <TreeNode title="分配权限" key={0} disabled>
                        {this.renderTree(resources)}
                    </TreeNode>
                </Tree>
            </Modal>
        );
    }
}

@Form.create()
class EditModal extends React.Component {
    render() {
        const { visible, onOk, onCancel, form: { getFieldDecorator, }, record, isCreate, } = this.props;
        return (
            <Modal
                title={isCreate ? '添加角色' : '修改角色'}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Form>
                    {
                        !isCreate &&
                        getFieldDecorator('id', {
                            initialValue: record._id,
                        })(
                            <Input type="hidden" />
                        )
                    }

                    <Form.Item label="角色名称">
                        {getFieldDecorator('name', {
                            initialValue: isCreate ? '' : record.name,
                        })(
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