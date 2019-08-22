import React from 'react';
import {Modal, Select, Transfer, } from 'antd';
import style from '../style.css';
const { Option, } = Select;
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
export default UserModal;