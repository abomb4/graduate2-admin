import React from 'react';
import { Layout } from 'antd';
import './BaseLayout.css';

const { Footer } = Layout;

class MainFooter extends React.Component {

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
      <Footer style={{ textAlign: 'center' }}>©2018 Created by wlyyy</Footer>
    );
  }
}

export default MainFooter;
