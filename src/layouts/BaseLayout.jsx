import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { Input, Layout, Menu, Breadcrumb } from 'antd';
import Pages from '../pages';
import './BaseLayout.css';

const { IndexPage, LoginPage, DemandPage, RecommendPage, NotFoundPage } = Pages;
const { Header, Content, Footer } = Layout;

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
      <Layout className="layout">
        <div id="main-top">
          <div className="logo"><Link to="/">ｗｌｙ</Link></div>
          <div id="main-search-container">
            <div id="main-search-wrapper">
              <Input.Search id="main-search" enterButton="搜索" placeholder="搜索职位关键字"/>
            </div>
          </div>
          <div id="main-profile" >登录</div>
        </div>
        <Header id="main-header">
          <div className="content">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[ this.detectCurrentMenu() ]}
              id="main-menu"
            >
              <Menu.Item key="index"><Link to="/">首页</Link></Menu.Item>
              <Menu.Item key="demand"><Link to="/demand">招聘岗位</Link></Menu.Item>
              <Menu.Item key="recommend"><Link to="/recommend">我的推荐</Link></Menu.Item>
            </Menu>
          </div>
        </Header>
        <Content id="main-content">
          <div className="page-content">
            <Breadcrumb id="main-breadcrumb" style={{ marginBottom: '12px', marginTop: '12px' }}>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Switch>
                <Route key='/demand' path='/demand' >
                  <Breadcrumb.Item>招聘岗位</Breadcrumb.Item>
                </Route>
                <Route key='/recommend' path='/recommend' >
                  <Breadcrumb.Item>我的推荐</Breadcrumb.Item>
                </Route>
              </Switch>
            </Breadcrumb>
          </div>
          <Switch>
            <Route key='/' path='/' exact component={ IndexPage } />
            <Route key='/index' path='/index' component={ IndexPage } />
            <Route key='/demand' path='/demand' component={ DemandPage } />
            <Route key='/recommend' path='/recommend' component={ RecommendPage } />

            <Route key='/' path='/' component={ NotFoundPage } />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2018 Created by wlyyy</Footer>
      </Layout>
    );
  }
}

export default withRouter(BaseLayout);
