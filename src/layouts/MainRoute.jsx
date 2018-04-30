import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import Pages from '../pages';
import './BaseLayout.css';

const { IndexPage, DemandPage, RecommendPage, NotFoundPage } = Pages;

/**
 * 基础URL，只管一级URL，下级URL由各大页面自行管理
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
      <Switch>
        <Route key='/' path='/' exact component={ IndexPage } />
        <Route key='/index' path='/index' component={ IndexPage } />
        <Route key='/demand' path='/demand' component={ DemandPage } />
        <Route key='/myProfile' path='/myProfile' component={ RecommendPage } />

        <Route key='/' path='/' component={ NotFoundPage } />
      </Switch>
    );
  }
}

export default withRouter(BaseLayout);
