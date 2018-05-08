import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Recommend from './recommend';
import './MyProfilePage.css';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { RecommendPage } = Recommend;

const { Component } = React;

export default class MyProfilePage extends Component {

  myProfileLinkMenu(path) {
    const currentPath = this.props.match.path;
    return currentPath + path;
  }

  render() {

    console.log(this.props);

    return (
      <Layout className="recommend-page page-content">
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <Menu.Item key="information"><Link to={ this.myProfileLinkMenu('/information') }>个人信息</Link></Menu.Item>
            <Menu.Item key="recommend"><Link to={ this.myProfileLinkMenu('/recommend') }>俺的推荐</Link></Menu.Item>
            <Menu.Item key="mydemand"><Link to={ this.myProfileLinkMenu('/mydemand') }>俺的招聘</Link></Menu.Item>
            <Menu.Item key="interviewee"><Link to={ this.myProfileLinkMenu('/interviewee') }>俺的面试</Link></Menu.Item>
            <Menu.Item key="score"><Link to={ this.myProfileLinkMenu('/score') }>俺的积分</Link></Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <Switch>
            <Route key={ this.myProfileLinkMenu('/information') } path={ this.myProfileLinkMenu('/information') } component={ RecommendPage } />
            <Route key={ this.myProfileLinkMenu('/recommend') } path={ this.myProfileLinkMenu('/recommend') } component={ RecommendPage } />
            <Route key={ this.myProfileLinkMenu('/mydemand') } path={ this.myProfileLinkMenu('/mydemand') } component={ RecommendPage } />
            <Route key={ this.myProfileLinkMenu('/interviewee') } path={ this.myProfileLinkMenu('/interviewee') } component={ RecommendPage } />
            <Route key={ this.myProfileLinkMenu('/score') } path={ this.myProfileLinkMenu('/score') } component={ RecommendPage } />
          </Switch>
        </Content>
      </Layout>
    );
  }
}
