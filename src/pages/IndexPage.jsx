import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Carousel } from 'antd';
import ItrsApi from '../api/ItrsApi';
import './IndexPage.css';

const { Component } = React;

class IndexPage extends Component {

  state = {
    data: {},
  }

  componentDidMount() {
    ItrsApi.getUser(1,
      (successResult) => {
        if (successResult.success) {
          this.setState({ data: successResult.data });
        } else {

        }
        console.log(successResult);
      },
      (failResult) => {
        console.log(failResult);
      }
    );
  }

  handleMenuClick(item) {

  }

  render() {
    const data = this.state.data;
    return (
      <div className="index-page">
        <div className="carousel">
          <Carousel autoplay>
            <div style={{ background: 'url("/assets/bg.png")', height: '500px' }}>
              <div className="page-content"><h3>1</h3></div>
            </div>
            <div style={{ background: 'url("/assets/bg2.png")', height: '500px' }}>
              <div className="page-content"><h3>2</h3></div>
            </div>
          </Carousel>
        </div>
        <div className="over-carousel page-content">
          <div className="left-waterfall">
            <Menu onClick={ this.handleMenuClick } style={{ width: '100%', height: '100%' }} mode="vertical" selectable={ false }>
              <Menu.SubMenu key="product" title={
                <Link to="#" className="job-name-container"><span className="job-cn-name">产品</span><span className="job-en-name">Product</span></Link>
              }>
                <Menu.Item key="analyser"><Link to="#" className="job-name-container">需求分析</Link></Menu.Item>
                <Menu.Item key="productManager">产品经理</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </div>
          <div className="right-waterfall">
            <h2>最热职位</h2>
            <div>
              <ul className="jobs">
                <li className="job-description"><Link to="#">高级测试工程师 - 测试总部</Link></li>
                <li className="job-description"><Link to="#">测试工程师 - 测试总部</Link></li>
                <li className="job-description"><Link to="#">初级测试工程师 - 测试总部</Link></li>
                <li className="job-description">
                  <Link to="#" title="高级人工智能产品架构总设计师 - 人工智能特别小组">
                    高级人工智能产品架构总设计师 - 人工智能特别小组
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="user">
          <p className="id">{ data.id }</p>
          <p className="userName">{ data.userName }</p>
          <p className="email">{ data.email }</p>
          <p className="gmtCreate">{ data.gmtCreate }</p>
          <p className="gmtModify">{ data.gmtModify }</p>
          <p className="realName">{ data.realName }</p>
          <p className="departmentId">{ data.departmentId }</p>
          <p className="sex">{ data.sex }</p>

        </div>
      </div>
    );
  }
}

export default IndexPage;
