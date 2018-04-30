import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import './BaseLayout.css';

class MainHeader extends React.Component {

  state = {
    inited: false
  }
  render() {
    var currentUserElement = null;

    currentUserElement = this.props.user
      ? <span>欢迎您，{ this.props.user.realName }</span>
      : <Link to="/login">登录</Link>;

    return (
      <div id="main-top">
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
