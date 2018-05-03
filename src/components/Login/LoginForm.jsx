import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox, Spin, Alert } from 'antd';
import { userActions } from '../../_actions';
import './LoginForm.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // reset login status
    userActions.logout()(this.props.dispatch);
  }

  componentWillUnmount() {
  }

  handleSubmit(e) {
    e.preventDefault();

    const onSuccess = this.props.onSuccess;

    this.props.form.validateFields(
      (err) => {
        if (!err) {
          this.setState({ submitted: true });
          console.info('success');
          const values = this.props.form.getFieldsValue();
          console.log(values);

          const { username, password } = values;
          const { dispatch } = this.props;
          if (username && password) {
            // FIXME remove callback
            userActions.login(username, password, onSuccess)(dispatch);
          }
        }
      },
    );
    
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    var message = null;
    if (this.props.loginError) {
      console.log(this.props.loginError);
      if (this.props.loginError.status) {
        message = this.props.loginError.status === 401 ? '用户名或密码错误' : '登录异常';
      } else {
        message = '网络异常';
      }
    }
    const alert = this.props.loginError ? <Alert closable message={ message } type="error"/> : null;

    return (
      <div className="login-form-container">
        <div className="message-wrapper">
          { alert }
        </div>
        <Form onSubmit={ this.handleSubmit } className="login-form" style={{ marginTop: '24px'}}>
          <Spin spinning={ this.props.logging === true }>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入您的用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住登录状态</Checkbox>
              )}
              <a className="login-form-forgot" href="">忘记密码</a>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { logging, error, user } = state.userReducer;

  return {
    loginError: error,
    user,
    logging
  };
}

const antdedLoginForm = Form.create()(LoginForm);

const connectedLoginForm = connect(mapStateToProps)(antdedLoginForm);
export { connectedLoginForm as LoginForm };
export default connectedLoginForm;
