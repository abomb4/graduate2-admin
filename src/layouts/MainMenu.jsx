import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './BaseLayout.css';

const { Header } = Layout;

/**
 * 主菜单，蓝色的那个
 */
class MainMenu extends React.Component {

  detectCurrentMenu() {
    const currentPath = this.props.location.pathname;
    if (currentPath === '/' || currentPath.startsWith('/index')) {
      return 'index';
    } else if (currentPath.startsWith('/recommend')) {
      return 'recommend';
    } else if (currentPath.startsWith('/demand')) {
      return 'demand';
    } else {
      return null;
    }
  }

  render() {
    return (
      <Header id="main-menu">
        <div className="content">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[ this.detectCurrentMenu() ]}
            id="main-menu"
          >
            <Menu.Item key="index"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="demand"><Link to="/demand">招聘岗位</Link></Menu.Item>
            <Menu.Item key="myProfile"><Link to="/myProfile">我的推荐</Link></Menu.Item>
          </Menu>
        </div>
      </Header>
    );
  }
}

export default withRouter(MainMenu);
