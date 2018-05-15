import React from 'react';
import { Form, Input, Select } from 'antd';
import { ItrsDictionaryApi } from '../../../api/ItrsApi';

/**
 * 用户创建表单
 */
class UserCreateForm extends React.Component {

  state = {
    isEdit: false,
    departmentList: [],
  }

  componentWillMount() {
    ItrsDictionaryApi.getDepartmentList(
      (success) => {
        this.setState({ departmentList: success.data });
      },
      (fail) => {}
    );
  }

  changeSex(text) {
    if (text === 1) {
      return '男';
    } else if (text === 2) {
      return '女';
    } else {
      return '未知';
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form className="candidate-detail-form" onChange={ (e) => { if (this.props.onChange) this.props.onChange(this.props.form.getFieldsValue());} }>
        <Form.Item
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('userName', {
            rules: [{
              required: true, message: '请输入用户名!',
            }],
          })(
            this.state.isEdit ? <Input disabled/> : <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="性别"
        >
          {getFieldDecorator('sex', {
            initialValue: '1',
            rules: [{
              required: true, message: '请选择被推荐人性别!',
            }],
          })(
            <Select>
              <Select.Option value="1">男</Select.Option>
              <Select.Option value="2">女</Select.Option>
              <Select.Option value="0">未知</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="真实姓名"
        >
          {getFieldDecorator('realName', {
            rules: [{
              required: true, message: '请输入真实姓名!',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="部门"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入部门!',
            }],
          })(
            <Select>
              {
                this.state.departmentList.map(d => <Select.Option key={ d.id } value={ d.id }>{ d.departmentName }</Select.Option>)
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'E-mail 格式错误',
            }, {
              required: true, message: '请填写被推荐人有效 E-mail!',
            }],
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(UserCreateForm);
