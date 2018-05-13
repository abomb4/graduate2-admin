import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Radio } from 'antd';
import { LinkUtils } from '../../utils';
import './DemandPage.css';

/**
 * 搜索框
 */
class DemandQueryForm extends React.Component {

  state = {
    inited : false
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.doSearch();
  }

  handleRootPositionChange(positionId) {
    this.props.form.setFieldsValue({ positionType: positionId });
    this.handlePositionChange();
  }

  handlePositionChange() {
    this.doSearch();
  }

  doSearch() {
    if (this.props.doSearch) {
      this.props.doSearch();
    }
  }

  detectPositionElements = function () {
    const { getFieldValue } = this.props.form;

    var currentRootPositionId;
    var currentSubPositionId;
    var rootList;
    var subList;
    
    const positionTypeField = getFieldValue('positionType'); // convert to fucking string
    const positionType = positionTypeField ? positionTypeField + '' : positionTypeField;

    if (this.props.positionTypeRootList.length <= 0) {
      // 列表里没数据
      currentRootPositionId = '';
      currentSubPositionId = '';
      rootList = [];
      subList = [];
    } else {
      // 列表有数据

      if (!positionType && positionType !== '') {
        // 接口有返回职位列表，但没返回当前职位类型
        // 取跟职位类型第一个作为根类型
        currentRootPositionId = '';
        currentSubPositionId = currentRootPositionId;
      } else {
        // 根据当前职位类别找到根和子
        const currentPositionElement = this.props.positionTypeMap[positionType];
        if (!currentPositionElement) {
          currentRootPositionId = '';
          currentSubPositionId = currentRootPositionId;
        } else if (currentPositionElement.parentId === undefined || currentPositionElement.parentId === 0) {
          // 无父节点，说明是根类型
          currentRootPositionId = positionType;
          currentSubPositionId = currentRootPositionId;
        } else {
          // 有父节点，说明是子类型
          const currentSubPositionElement = currentPositionElement;
          currentRootPositionId = currentSubPositionElement.parentId;
          currentSubPositionId = positionType;
        }
      }
      currentRootPositionId = toFuckingString(currentRootPositionId); // convert to fucking string
      currentSubPositionId = toFuckingString(currentSubPositionId); // convert to fucking string

      rootList = [];
      rootList.push(<Radio.Button key="all" value={ '' }>全部</Radio.Button>);
      this.props.positionTypeRootList.forEach(root =>
        rootList.push(<Radio.Button key={ toFuckingString(root.id) } value={ toFuckingString(root.id) }>{ root.chineseName }</Radio.Button>)
      );

      subList = [];
      subList.push(<Radio.Button key={ currentRootPositionId } value={ currentRootPositionId }>全部</Radio.Button>);
      if (currentRootPositionId !== '') {
        const currentRootPositionElement = this.props.positionTypeMap[currentRootPositionId];
        currentRootPositionElement.subTypes.forEach(sub => {
          subList.push(<Radio.Button key={ toFuckingString(sub.id) } value={ toFuckingString(sub.id) }>{ sub.chineseName }</Radio.Button>);
        });
      }
    }
    return {
      currentRootPositionId: currentRootPositionId,
      currentSubPositionId: currentSubPositionId,
      rootList: rootList,
      subList: subList,
    };
  }.bind(this);

  componentDidMount() {
    const urlParameters = LinkUtils.parseGetParameter(this.props.location.search);
    const { positionType, id, jobName } = urlParameters;

    if (!this.state.inited) {
      this.props.form.setFieldsValue({ positionType: positionType, id: id, jobName: jobName});
      this.setState({inited: true});
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const {
      currentRootPositionId,
      currentSubPositionId,
      rootList,
      subList,
    } = this.detectPositionElements();

    return (
      <div className='demand-query-form'>
        <div className="page-content">
          <Form className="demand-search-form" onSubmit={ this.handleSearch }>
            { getFieldDecorator('id', {  })(
              <Input style={{ display: 'none' }} />
            )}
            <Row gutter={24}>
              <Col span={18}>
                <div className="position-type radio-container">
                  <span className="label">职位：</span>
                  <Radio.Group value={ currentRootPositionId } onChange={ (event) => this.handleRootPositionChange(event.target.value) }>
                    { rootList }
                  </Radio.Group>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={18}>
                <div className="position-sub-type radio-container">
                  <span className="label">职位子类：</span>
                  { getFieldDecorator('positionType', { value: currentSubPositionId })(
                    <Radio.Group onChange={ (event) => this.handleRootPositionChange(event.target.value) }>{ subList }</Radio.Group>
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="工作地点： " {...formItemLayout}>
                  { getFieldDecorator('workingPlace',
                    { initialValue: '' }
                  )(
                    <Select >
                      <Select.Option value="">不限</Select.Option>
                      <Select.Option value="杭州">杭州</Select.Option>
                      <Select.Option value="苏州">苏州</Select.Option>
                      <Select.Option value="上海">上海</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="岗位名： " {...formItemLayout}>
                  { getFieldDecorator('jobName', {})(<Input />) }
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit" onClick={ this.handleSearch }>搜索</Button>
                <Button style={{ marginLeft: 8 }} onClick={ this.handleReset }>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(DemandQueryForm);

function toFuckingString(e) {
  return e + '';
}

