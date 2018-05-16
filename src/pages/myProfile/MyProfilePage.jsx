import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { authorizationFunctions } from '../../helpers';
import { loginActions } from '../../_actions';
import {
  RecommendPage, IntervieweePage, MydemandPage,
  HomePage, ScorePage, HistoryPage, EmailLogPage,
  ModifyPasswordPage, FollowingDemandPage, UserPage,
  DeployPage
} from '.';
import './MyProfilePage.css';

const { Content, Sider } = Layout;

const { Component } = React;

class MyProfilePage extends Component {

  myProfileLinkMenu(path) {
    const currentPath = this.props.match.path;
    return currentPath + path;
  }

  componentDidMount() {
    if (!this.props.loginUser) {
      loginActions.show()(this.props.dispatch);
    }
  }

  detectCurrentMenu() {
    const fullPath = this.props.location.pathname;
    const baseMatch = this.props.match.path;
    const subPath = fullPath.substring(baseMatch.length, fullPath.length);

    const nextStash = subPath.substring(1, subPath.length).indexOf('/');
    if (nextStash > 0) {
      return subPath.substring(0, nextStash + 1);
    } else {
      return subPath;
    }
  }

  render() {

    const currentMenu = this.detectCurrentMenu();

    return (
      <div>
        { this.props.loginUser ?
          <Layout className="page-content">
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                selectedKeys={[currentMenu]}
                style={{ height: '100%' }}
              >
                {/* <Menu.Item key="home"><Link to={ this.myProfileLinkMenu('/home') }>综合信息</Link></Menu.Item> */}
                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_ADMIN')) ?  <Menu.Item key="/user"><Link to={ this.myProfileLinkMenu('/user')}>用户管理</Link></Menu.Item> : null }

                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_ADMIN')) ?  <Menu.Item key="/emailLog"><Link to={ this.myProfileLinkMenu('/emailLog')}>查看邮件日志</Link></Menu.Item> : null }

                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_ADMIN')) ?  <Menu.Item key="/deploy"><Link to={ this.myProfileLinkMenu('/deploy')}>招聘流程部署</Link></Menu.Item> : null }

                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_HR')) ? <Menu.Item key="/mydemand"><Link to={ this.myProfileLinkMenu('/mydemand') }>我的招聘</Link></Menu.Item> : null }

                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_INTERVIEWEE')) ? <Menu.Item key="/interviewee"><Link to={ this.myProfileLinkMenu('/interviewee') }>我的面试</Link></Menu.Item> : null }

                { (authorizationFunctions.haveRole(this.props.loginUser, 'ROLE_MANAGER')) ? <Menu.Item key="/followingDemand"><Link to={ this.myProfileLinkMenu('/followingDemand') }>部门招聘</Link></Menu.Item> : null }

                <Menu.Item key="/recommend"><Link to={ this.myProfileLinkMenu('/recommend') }>我的推荐</Link></Menu.Item>
                <Menu.Item key="/score"><Link to={ this.myProfileLinkMenu('/score') }>我的积分</Link></Menu.Item>
                <Menu.Item key="/history"><Link to={ this.myProfileLinkMenu('/history') }>我的历史</Link></Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Switch>
                <Route key={ this.myProfileLinkMenu('/home') } path={ this.myProfileLinkMenu('/home') } exact component={ HomePage } />
                <Route key={ this.myProfileLinkMenu('/user') } path={ this.myProfileLinkMenu('/user') } exact component={ UserPage } />
                <Route key={ this.myProfileLinkMenu('/emailLog') } path={ this.myProfileLinkMenu('/emailLog') } exact component={ EmailLogPage } />
                <Route key={ this.myProfileLinkMenu('/deploy') } path={ this.myProfileLinkMenu('/deploy') } exact component={ DeployPage } />
                <Route key={ this.myProfileLinkMenu('/recommend') } path={ this.myProfileLinkMenu('/recommend') } component={ RecommendPage } />
                <Route key={ this.myProfileLinkMenu('/mydemand') } path={ this.myProfileLinkMenu('/mydemand') } component={ MydemandPage } />
                <Route key={ this.myProfileLinkMenu('/followingDemand') } path={ this.myProfileLinkMenu('/followingDemand') } component={ FollowingDemandPage } />
                <Route key={ this.myProfileLinkMenu('/interviewee') } path={ this.myProfileLinkMenu('/interviewee') } component={ IntervieweePage } />
                <Route key={ this.myProfileLinkMenu('/score') } path={ this.myProfileLinkMenu('/score') } component={ ScorePage } />
                <Route key={ this.myProfileLinkMenu('/history') } path={ this.myProfileLinkMenu('/history') } component={ HistoryPage } />
                <Route key={ this.myProfileLinkMenu('/modifyPassword') } path={ this.myProfileLinkMenu('/modifyPassword') } component={ ModifyPasswordPage } />
                <Redirect to={ this.myProfileLinkMenu('/home') } />
              </Switch>
            </Content>
          </Layout>
          : <div className="page-content">您必须<a onClick={ () => loginActions.show()(this.props.dispatch) }>登录</a>后才能使用个人中心功能</div>
        }
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
export default connect(mapStateToProps)(MyProfilePage);
