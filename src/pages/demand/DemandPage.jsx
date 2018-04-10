import React from 'react';
import { Form, Row, Col, Input, Select, Button} from 'antd';
import './DemandPage.css';

const { Component } = React;

class DemandQueryForm extends Component {

  handleReset = () => {
    console.log('dd');
    this.props.form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  }


  render() {
    return (
      <Form className="demand-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={6} order={1}>
            <Form.Item label="业委会： ">
              <Select defaultValue="请选择..." style={{ width: 200 }}>
                <Select.Option value="交易所业委会">交易所业委会</Select.Option>
                <Select.Option value="银行业委会">银行业委会</Select.Option>
                <Select.Option value="财富业委会">财富业委会</Select.Option>
              </Select>
            </Form.Item></Col>
          <Col span={6} order={2}><Form.Item label="BU： "><Input style={{ width: 200 }} /></Form.Item></Col>
          <Col span={6} order={3}><Form.Item label="岗位： "><Input style={{ width: 200 }} /></Form.Item></Col>
        </Row>
        <Row gutter={24}>
          <Col span={6} order={1}><Form.Item label="关键词： "><Input style={{ width: 200 }} /></Form.Item></Col>
          <Col span={6} order={2}><Form.Item label="工作地点： "><Input style={{ width: 200 }} /></Form.Item></Col>
          <Col span={6} order={3}><Form.Item label="招聘HR： "><Input style={{ width: 200 }} /></Form.Item></Col>
          <Col span={6} order={3}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button></Col>
        </Row>
      </Form>
    );
  }
}

DemandQueryForm = Form.create({})(DemandQueryForm);

class DemandPage extends Component {

  render() {
    return (
      <DemandQueryForm />
    );
  }
}

export default DemandPage;
