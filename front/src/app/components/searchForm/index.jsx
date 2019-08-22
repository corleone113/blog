import React from 'react';
import { Form, Input, Button, } from 'antd';

@Form.create()
class SearchForm extends React.Component {
    render() {
        const { form: { getFieldDecorator, }, onSearch, fieldName, } = this.props;
        return (
            <Form layout="inline">
                <Form.Item label="用户名">
                    {getFieldDecorator(fieldName, {
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

export default SearchForm;