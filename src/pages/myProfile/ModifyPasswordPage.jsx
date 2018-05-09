import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { ItrsUserApi } from '../../api/ItrsApi';
import { userActions } from '../../_actions';

class ModifyPasswordPage extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ItrsUserApi.modifyPassword(values,
          (success) => {
            message.success('密码修改成功，您需要重新登录。');
            userActions.logout()(dispatch);
          },
          (fail) => {
            message.error('密码修改失败。' + fail.message);
          }
        );
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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
    const tailformItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Row>
        <Col span={18}>
          <Form onSubmit={ this.handleSubmit }>
            <Form.Item
              {...formItemLayout}
              label="原密码"
            >
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true, message: '请输入原密码!',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="新密码"
            >
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true, message: '请输入新密码!',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="重复新密码"
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请再次输入新密码!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={ this.handleConfirmBlur } />
              )}
            </Form.Item>
            <Form.Item {...tailformItemLayout}>
              <Button type="primary" htmlType="submit">修改密码</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default connect(() => { return {}; })(Form.create()(ModifyPasswordPage));
