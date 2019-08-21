import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import { Card, Table, Button, Modal, Form, Input, Transfer, Select, } from 'antd';
import { actions as manageActions, } from '@/reducers/manageReducer';
import style from './style.css';

const entity = 'user';
const { Option, } = Select;

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
            this.props.manage_set(entity, { ids, sets, }, this.query());
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


class UserModal extends React.Component {
    render() {
        const { visible, onOk, onCancel, onChange, targetKeys, selectedRows, roleChange, targetRole, roles, } = this.props;
        return (
            <Modal
                title="分配角色"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <label className={style.label_pos}>角色:</label>
                <Select defaultValue={targetRole} style={{ width: 179, }} className={style.select_pos} onChange={roleChange}>
                    {roles.map(role => {
                        const isAdmin = role.name === '系统管理员';
                        return (<Option value={role.name} disabled={isAdmin} key={role._id}>{role.name}</Option>);
                    })}
                </Select>
                <Transfer
                    dataSource={selectedRows}
                    targetKeys={targetKeys}
                    titles={['待分配', '已分配', ]}
                    onChange={onChange}
                    render={row => row.username}
                    rowKey={row => row._id}
                />

            </Modal>
        );
    }
}

@Form.create()
class SearchForm extends React.Component {
    render() {
        const { form: { getFieldDecorator, }, onSearch, } = this.props;
        return (
            <Form layout="inline">
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
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



function mapStateToProps(state) {
    return {
        // userInfo: state.manage.userInfo,
        ...state.manage,
        isFetching: state.globalState.isFetching,
    };
}

export default connect(mapStateToProps, manageActions)(User);