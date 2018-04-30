import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Carousel } from 'antd';
import { ItrsDataApi } from '../api/ItrsApi';
import './IndexPage.css';

const { Component } = React;

class LeftWaterfall extends Component {

  state = {
    data: []
  }

  componentDidMount() {
    ItrsDataApi.getPositions(
      (successResult) => {
        if (successResult.success) {
          const data = successResult.data;
          this.setState({ data: data });
        } else {
          console.error(successResult);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleMenuClick(item) {
  }

  render() {

    const menuList = [];
    const data = this.state.data;
    for (var i in data) {
      const parentPosition = data[i];
      const subTypes = parentPosition.subTypes;
      const subMenus = [];

      for (var j in subTypes) {
        const subPosition = subTypes[j];
        subMenus.push(<Menu.Item key={ subPosition.id }><Link to="#" className="job-name-container">{ subPosition.chineseName }</Link></Menu.Item>);
      }

      const parentMenu = (
        <Menu.SubMenu key={ parentPosition.id } title={
          <Link to="#" className="job-name-container"><span className="job-cn-name">{ parentPosition.chineseName }</span><span className="job-en-name">{ parentPosition.englishName }</span></Link>
        }>
          { subMenus }
        </Menu.SubMenu>
      );

      menuList.push(parentMenu);
    }
  
    return (
      <div className="left-waterfall">
        <Menu onClick={ this.handleMenuClick } subMenuOpenDelay={ 0.07 } style={{ width: '100%', height: '100%' }} mode="vertical" selectable={ false }>
          { menuList }
        </Menu>
      </div>
    );
  }
}
class IndexPage extends Component {
  
  render() {
    return (
      <div className="index-page">
        <div className="carousel">
          <Carousel autoplay infinite >
            <div>
              <div className="picture" style={{ background: 'url("/assets/bg.png")' }}>
                <div className="page-content"><h3>1</h3></div>
              </div>
            </div>
            <div>
              <div className="picture" style={{ background: 'url("/assets/bg2.png")' }}>
                <div className="page-content"><h3>2</h3></div>
              </div>
            </div>
          </Carousel>
        </div>
        <div className="over-carousel page-content">
          <LeftWaterfall />
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
      </div>
    );
  }
}

export default IndexPage;
