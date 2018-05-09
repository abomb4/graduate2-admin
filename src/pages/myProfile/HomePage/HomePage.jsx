import React from 'react';
import { Card } from 'antd';
import './HomePage.css';

class HomePage extends React.Component {

  render() {
    return (
      <div className="profile-home-page">
        <Card title="我的推荐" extra={<a>更多</a>}>
          <p>Java高级工程师 - 翁打包</p>
          <p>NLP工程师 - 翁小包</p>
        </Card>
        <Card title="我的积分" extra={<a>更多</a>}>
          <p>2018-05-09 推荐积分+10</p>
          <p>2018-05-07 推荐积分+20</p>
        </Card>
        <Card title="我的招聘" extra={<a>更多</a>}>
          <p>2018-05-09 推荐积分+10</p>
          <p>2018-05-07 推荐积分+20</p>
        </Card>
        <Card title="我的面试" extra={<a>更多</a>}>
          <p>2018-05-09 打死</p>
          <p>2018-05-07 推荐积分+20</p>
        </Card>
      </div>
    );
  }
}

export default HomePage;
