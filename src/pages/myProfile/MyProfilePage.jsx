import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { loginActions } from '../../_actions';
import { RecommendPage, IntervieweePage, MydemandPage, HomePage, ScorePage, HistoryPage, ModifyPasswordPage } from '.';
import './MyProfilePage.css';

const { Content, Sider } = Layout;

const { Component } = React;

class MyProfilePage extends Component {

  state = {
    positionTypeInited: false,
    positionTypeMap: {},
  }

  myProfileLinkMenu(path) {
    const currentPath = this.props.match.path;
    return currentPath + path;
  }

  componentDidMount() {
    console.log(this.props);
    if (!this.props.loginUser) {
      loginActions.show()(this.props.dispatch);
    }
    console.log('mount myProfile component');
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

    // console.log(this.props);

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
                <Menu.Item key="/recommend"><Link to={ this.myProfileLinkMenu('/recommend') }>俺的推荐</Link></Menu.Item>
                <Menu.Item key="/mydemand"><Link to={ this.myProfileLinkMenu('/mydemand') }>俺的招聘</Link></Menu.Item>
                <Menu.Item key="/interviewee"><Link to={ this.myProfileLinkMenu('/interviewee') }>俺的面试</Link></Menu.Item>
                <Menu.Item key="/score"><Link to={ this.myProfileLinkMenu('/score') }>俺的积分</Link></Menu.Item>
                <Menu.Item key="/history"><Link to={ this.myProfileLinkMenu('/history') }>俺的历史</Link></Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Switch>
                <Route key={ this.myProfileLinkMenu('/home') } path={ this.myProfileLinkMenu('/home') } exact component={ HomePage } />
                <Route key={ this.myProfileLinkMenu('/recommend') } path={ this.myProfileLinkMenu('/recommend') } component={ RecommendPage } />
                <Route key={ this.myProfileLinkMenu('/mydemand') } path={ this.myProfileLinkMenu('/mydemand') } positionTypeMap={ this.state.positionTypeMap } component={ MydemandPage } />
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
