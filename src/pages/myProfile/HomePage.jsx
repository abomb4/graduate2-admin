import React from 'react';
import { Card } from 'antd';

class HomePage extends React.Component {

  render() {
    return (
      <div>
        <Card title="我的推荐" extra={<a>更多</a>} style={{ width: 300 }}>
          <p>Java高级工程师 - 翁打包</p>
          <p>NLP工程师 - 翁小包</p>
        </Card>
      </div>
    );
  }
}

export default HomePage;
