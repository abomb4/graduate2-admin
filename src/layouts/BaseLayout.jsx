import React from 'react';
import { withRouter } from 'react-router-dom';
import { CheckLoginStatus, MainLayout, MainHeader, MainMenu, MainContent, MainRoute, MainFooter } from '.';
import './BaseLayout.css';

/**
 * 基础布局，这个只管一级URL，下级URL由各大页面自行管理
 * 
 */
class BaseLayout extends React.Component {

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
      <MainLayout>
        <CheckLoginStatus />
        <MainHeader />
        <MainMenu />
        <MainContent>
          <MainRoute />
        </MainContent>
        <MainFooter />
      </MainLayout>
    );
  }
}

export default withRouter(BaseLayout);
