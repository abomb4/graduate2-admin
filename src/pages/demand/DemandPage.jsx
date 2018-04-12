import React from 'react';
import { Form, Row, Col, Table, Input, Select, Button, Icon } from 'antd';
import './DemandPage.css';

const { Component } = React;

/**
 * 搜索框
 */
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

    return (
      <div className='demand-query-form'>
        <div className="page-content">
          <Form className="demand-search-form" onSubmit={ this.handleSearch }>
            <Form.Item> { getFieldDecorator('pageNo', { initialValue: 1 })(<Input style={{ display: 'none' }} />)} </Form.Item>
            <Form.Item> { getFieldDecorator('pageSize', { initialValue: this.props.pageSize })(<Input style={{ display: 'none' }} />)} </Form.Item>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="业委会： " {...formItemLayout}>
                  { getFieldDecorator('department_id', 
                    {
                      rules: [{
                        required: true,
                        message: 'Input something!',
                      }],
                      initialValue: '请选择...'
                    })(
                    <Select >
                      <Select.Option value="交易所业委会">交易所业委会</Select.Option>
                      <Select.Option value="银行业委会">银行业委会</Select.Option>
                      <Select.Option value="财富业委会">财富业委会</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}><Form.Item label="BU： " {...formItemLayout}><Input /></Form.Item></Col>
              <Col span={6}><Form.Item label="岗位： " {...formItemLayout}><Input /></Form.Item></Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}><Form.Item label="关键词： " {...formItemLayout}><Input /></Form.Item></Col>
              <Col span={6}><Form.Item label="工作地点： " {...formItemLayout}><Input /></Form.Item></Col>
              <Col span={6}><Form.Item label="招聘HR： " {...formItemLayout}><Input /></Form.Item></Col>
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

/**
 * 结果列表
 */
class DemandList extends Component {

  static columns = [{
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  }, {
    title: '部门',
    dataIndex: 'department_name',
    key: 'department_name',
  }, {
    title: '招聘人数',
    dataIndex: 'total',
    key: 'total',
  }, {
    title: '工作地点',
    dataIndex: 'working_place',
    key: 'working_place',
  }, {
    title: '招聘HR',
    dataIndex: 'hr_name',
    key: 'hr_name',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="">推荐</a>
        <span>　　　</span>
        <a href="" className="ant-dropdown-link"><Icon type="down" /></a>
      </span>
    ),
  }];

  render() {
    return (
      <Table columns={ DemandList.columns } dataSource={ this.props.dataSource } pagination={ this.props.pagination } />
    );
  }
}

class DemandPage extends Component {

  handlePageChange(pageNo, pageSize) {
    this.props.form.setFieldsValue({
      pageNo: pageNo,
      pageSize: pageSize,
    });
  }

  render() {
    const data = [
      {
        id: 1,
        key: 1,
        position: '动词大慈工程师',
        department_name: '动词大慈所',
        total: 3,
        working_place: 'Moon',
        hr_name: '超级hr'
      },
      {
        id: 2,
        key: 2,
        position: '动词大2慈工程师',
        department_name: '动词2大慈所',
        total: 3,
        working_place: 'Mo2n',
        hr_name: '超级2hr'
      },
      {
        id: 3,
        key: 3,
        position: '动词大慈3工程师',
        department_name: '动词大1慈所',
        total: 33,
        working_place: 'Moo32n',
        hr_name: '超13级hr'
      },
    ];

    const pageSize = 1;

    // TODO 分页点击之后，触发表单提交事件
    const pagination = {
      pageSize: pageSize,
      pageNo: this.props.form.getFieldValue('pageNo'),
      total: 12,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div id='demand-page'>
        <DemandQueryForm form={ this.props.form } pageSize={ pageSize } />
        <div className='page-content demand-page-main'>
          <div className="demand-list-container">
            <DemandList dataSource={ data } pagination={ pagination } />
          </div>
          <div className="demand-suggest-container">
            <div style={{ width: 300, height:340, background: 'red' }} >
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({})(DemandPage);
