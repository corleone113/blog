import React from 'react';
import { Form, Input, Modal, } from 'antd';

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

export default EditModal;