import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input } from 'antd';

class MainHeader extends React.Component {

  render() {
    return (
      <div id="main-top">
        <div className="logo"><Link to="/">ｗｌｙ</Link></div>
        <div id="main-search-container">
          <div id="main-search-wrapper">
            <Input.Search id="main-search" enterButton="搜索" placeholder="搜索职位关键字"/>
          </div>
        </div>
        {
          this.props.user
            ? <div id="main-profile">欢迎您，{ this.props.user.realName }</div>
            : <div id="main-profile" >登录</div>
        }
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
