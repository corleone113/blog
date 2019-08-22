import React from 'react';
import {Modal, Form, Input, } from 'antd';

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

export default EditModal;