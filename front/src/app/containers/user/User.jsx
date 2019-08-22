import React, { Component, } from 'react';
import loadable from '@loadable/component';
import { connect, } from 'react-redux';
import { Card, Table, Button, } from 'antd';
import { actions as manageActions, } from '@/reducers/manageReducer';

const entity = 'user';
const SearchForm = loadable(()=>import('@/components/searchForm'));
const UserModal = loadable(()=>import('./components/UserModal'));

class User extends Component {
    componentDidMount() {
        this.props.manage_change({selectedRows:[], selectedRowKeys:[], });
        this.props.manage_get(entity, this.query());
        this.props.manage_get_all('role');
    }
    query = () => ({
        pageNum: 1,
        username: JSON.stringify({ $ne: 'admin', }),
    });
    onSearch = () => {
        const values = this.searchForm.props.form.getFieldsValue();
        const where = Object.keys(values).reduce((memo, key) => {
            if (values[key]) {
                memo[key] = values[key];
            }
            return memo;
        }, {});
        const finalQuery = { ...this.query(), ...where, };
        if (finalQuery.username && Object.keys(where).length>0) {
            finalQuery.username = JSON.stringify(finalQuery.username);
            console.log('User query:', finalQuery);
        }
        if (finalQuery.username === '"admin"') {
            delete finalQuery.username;
            finalQuery.errorCondition = '';
        }
        this.props.manage_get(entity, finalQuery);
    }
    setUserRole = () => {//给角色授与资源
        if (this.props.selectedRowKeys.length === 0) {
            this.props.manage_error('请至少选择一个用户!');
            this.props.manage_change({ userVisible: false, });
        } else {
            const defaultRole = this.props.roles.find(role => role.name !== '系统管理员');
            this.props.manage_change({ userVisible: true, targetRole: defaultRole.name, });
        }
    }
    setUserRoleCancel = () => {
        this.props.manage_change({ userVisible: false, });
    }
    setUserRoleOk = () => {
        const ids = Array.from(this.props.targetKeys);
        const sets = [];
        if (ids.length === 0) {
            this.props.manage_error('至少选择一个要分配角色的用户!');
        } else {
            for (let i = 0; i < ids.length; ++i) {
                sets.push({ role: this.props.targetRole, });
            }
            this.props.manage_set(entity, { ids, sets, }, {...this.query(), pageNum:this.props.pageNum, });
        }
    }
    onUserChange = (targetKeys) => {
        this.props.manage_change({ targetKeys, });
    }
    onRoleChange = (value) => {
        this.props.manage_change({ targetRole: value, });
    }
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '角色类型',
                dataIndex: 'role',
                key: 'role',
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                render: (val) => {
                    return val === 0 ? '女' : '男';
                },
            },
        ];
        const { list, pageNum, total, pageSize, isFetching, record, userVisible, targetKeys, roles, selectedRowKeys, } = this.props;
        // const filteredList = list.filter(user => user.username !== 'admin');
        const pagination = {
            current: pageNum,
            pageSize: pageSize,
            total: total,
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
        return (
            <>
                <Card>
                    <SearchForm
                        // where={where}
                        onSearch={this.onSearch}
                        wrappedComponentRef={inst => this.searchForm = inst}
                        label="用户名"
                        fieldName="username"
                    />
                </Card>
                <Card>
                    <Button.Group>
                        <Button style={{ marginLeft: '10px', }} type="warning" onClick={this.setUserRole}>分配角色</Button>
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
                    <UserModal
                        visible={userVisible}
                        onOk={this.setUserRoleOk}
                        onCancel={this.setUserRoleCancel}
                        record={record}
                        targetKeys={targetKeys}
                        onChange={this.onUserChange}
                        roleChange={this.onRoleChange}
                        targetRole={this.props.targetRole}
                        roles={roles}
                        selectedRows={this.props.selectedRows}
                    />
                </Card>
            </>
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

export default connect(mapStateToProps, manageActions)(User);