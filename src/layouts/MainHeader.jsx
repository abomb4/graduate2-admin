import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Modal, Button, message, Popover } from 'antd';
import { LoginForm } from '../components/Login';
import { urlFunctions } from '../helpers';
import { userActions, loginActions } from '../_actions';
import './BaseLayout.css';

class MainHeader extends React.Component {

  constructor(props) {
    super(props);
    this.onJobNameSearch.bind(this)
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    userActions.cancel()(dispatch);
    loginActions.hide()(dispatch);
  }

  handleLogoutOk() {
    const { dispatch } = this.props;
    // FIXME remove callback
    return userActions.logout(() => { message.success('登出成功', 2); })(dispatch);
  }

  onLoginSuccess() {
    const { dispatch } = this.props;
    message.success('登录成功', 2);
    loginActions.hide()(dispatch);
    window.location.href = '/index';
  }

  // 根据职位关键字进行模糊搜索
  onJobNameSearch(value) {
    window.location.href = urlFunctions.queryDemandUrl({ jobName: value });
  }

  render() {
    const { dispatch } = this.props;

    var currentUserElement = null;

    // 当前用户信息
    currentUserElement = this.props.loginUser
      ? <span>欢迎您，
        <Popover content={ <Link to="/myProfile/modifyPassword">修改密码</Link> }>
          <span style={{ cursor: 'pointer' }}>{ this.props.loginUser.realName }</span>
        </Popover>。
        <a onClick={ () => Modal.confirm({
          title: '确定登出？',
          content: '确定要登出吗？',
          okText: '登出',
          cancelText: '取消',
          onOk: () => this.handleLogoutOk()
        }) }>登出</a>
      </span>

      : <a onClick={ () => loginActions.show()(dispatch) }>登录</a>;

    return (
      <div id="main-top">

        <Modal
          visible={ this.props.showLogin }
          title="登录"
          onCancel={ this.handleCancel }
          footer={[
            <Button key="back" onClick={ () => this.handleCancel() } >取消</Button>
          ]}
        >
          <div className="main-login-form-container">
            <LoginForm onSuccess={() => { this.onLoginSuccess(); }}/>
          </div>
        </Modal>
        <div className="logo"><Link to="/">ｗｌｙ</Link></div>
        <div id="main-search-container">
          <div id="main-search-wrapper">
            <Input.Search id="main-search" enterButton="搜索" placeholder="搜索职位关键字" onSearch = { this.onJobNameSearch }/>
          </div>
        </div>
        <div id="main-profile">{ currentUserElement }</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.userReducer;
  const { show } = state.loginReducer;

  return {
    loginUser: user,
    showLogin: show
  };
}
const connectedMainHeader = connect(mapStateToProps)(MainHeader);

export default connectedMainHeader;
