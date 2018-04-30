import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Modal, Button } from 'antd';
import { LoginForm } from '../components/Login';
import { userActions } from '../_actions';
import './BaseLayout.css';

class MainHeader extends React.Component {

  state = {
    inited: false,
    showLogin: false,
  }

  handleCancel = () => {
    this.setState({ showLogin: false });
  }

  render() {
    var currentUserElement = null;

    const { dispatch } = this.props;

    currentUserElement = this.props.user
      ? <span>
          欢迎您，{ this.props.user.realName }。
        <a onClick={ () => Modal.confirm({
          title: '确定登出？',
          content: '确定要登出吗？',
          okText: '登出',
          cancelText: '取消',
          onOk() {
            return userActions.logout()(dispatch);
          }
        }) }>登出</a>
      </span>
      : <a onClick={ () => this.setState({ showLogin: true }) }>登录</a>;

    if (this.props.user && this.state.showLogin) {
      this.setState({ showLogin: false });
    }
    return (
      <div id="main-top">

        <Modal
          visible={ this.state.showLogin }
          title="登录"
          onCancel={ this.handleCancel }
          footer={[
            <Button key="back" onClick={ this.handleCancel }>取消</Button>
          ]}
        >
          <div className="main-login-form-container">
            <LoginForm />
          </div>
        </Modal>
        <div className="logo"><Link to="/">ｗｌｙ</Link></div>
        <div id="main-search-container">
          <div id="main-search-wrapper">
            <Input.Search id="main-search" enterButton="搜索" placeholder="搜索职位关键字"/>
          </div>
        </div>
        <div id="main-profile">{ currentUserElement }</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.userReducer;
  return {
    user
  };
}
const connectedMainHeader = connect(mapStateToProps)(MainHeader);

export default connectedMainHeader;
