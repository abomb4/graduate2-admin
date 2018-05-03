import React from 'react';
import { withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import './BaseLayout.css';

/**
 * 主框架
 */
class BaseLayout extends React.Component {
  render() {
    return (
      <Layout className="layout">
        { this.props.children }
      </Layout>
    );
  }
}

export default withRouter(BaseLayout);
