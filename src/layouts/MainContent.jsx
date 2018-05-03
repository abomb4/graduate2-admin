import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import './BaseLayout.css';

const { Content } = Layout;

/**
 * 主Container
 */
class MainContent extends React.Component {

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
      <Content id="main-content">
        <div className="page-content">
          <Breadcrumb id="main-breadcrumb" style={{ marginBottom: '12px', marginTop: '12px' }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Switch>
              <Route key='/demand' path='/demand' >
                <Breadcrumb.Item>招聘岗位</Breadcrumb.Item>
              </Route>
              <Route key='/myProfile' path='/myProfile' >
                <Breadcrumb.Item>个人中心</Breadcrumb.Item>
              </Route>
            </Switch>
          </Breadcrumb>
        </div>
        { this.props.children } 
      </Content>
    );
  }
}

export default withRouter(MainContent);
