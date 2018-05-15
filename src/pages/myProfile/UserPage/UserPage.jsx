import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import {
  Form, Spin, Table,
  Modal, Input, Popconfirm,
  message, Button, Radio,
  Row, Col, Select
} from 'antd';
import { ItrsFlowApi, ItrsDemandApi, ItrsCandidateApi, ItrsUserApi } from '../../../api/ItrsApi';
import { CreateDemandPage } from '.';
import { CandidateDetailForm } from '../component';
import './UserPage.css';
import UserCreateForm from './UserCreateForm';

class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pagination: { pageNo: 1, pageSize: 10, total: 0 },
      loadingUser: false,
      showCreateModal: false,
      createFormData: {},
    };
    this.onFormSearch.bind(this);
    this.onPageChange.bind(this);
    this.onCreateFormShow.bind(this);
    this.onCreateFormClose.bind(this);
    this.onCreateFormChange.bind(this);
    this.onCreateFormSubmit.bind(this);
  }

  componentDidMount() {
    this.doQuery();
  }

  getLink(path) {
    const currentPath = this.props.match.path;
    return currentPath + path;
  }

  // =------- 列表搜索相关 ---------=
  onFormReset = () => {
    this.props.form.resetFields();
  }

  onFormSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { pageSize, total } = this.state.pagination;
        this.setState(
          { pagination: { pageNo: 1, pageSize, total }},
          () => this.doQuery()
        );
      }
    });
  }

  onPageChange(pn) {
    const { pageSize, total } = this.state.pagination;
    this.setState(
      { pagination: { pageNo: pn, pageSize, total }},
      () => this.doQuery()
    );
  }

  doQuery() {
    this.setState({ loadingUser: true });
    const postParams = Object.assign(this.state.pagination, this.props.form.getFieldsValue());

    ItrsUserApi.listUserPage(postParams,
      (success) => {
        const { pageNo, pageSize } = this.state.pagination;
        if (success.success) {
          this.setState({
            dataSource: success.datas,
            pagination: { pageNo, pageSize, total: success.total },
            loadingUser: false,
          });
        }
      },
      (fail) => {}
    );
  }
  // =------- 列表搜索相关 end ---------=

  // =--------- 新增与修改 ----------=
  onCreateFormShow = () => {
    this.setState({ showCreateModal: true });
  }

  onCreateFormClose = () => {
    this.setState({ isEdit: false, showCreateModal: false, createFormData: {} });
  }

  onCreateFormChange = (value) => {
    this.setState({ createFormData: value });
  }

  onCreateFormSubmit = (value) => {
    if (this.state.isEdit) {
      this.doModify(this.state.createFormData);
    } else {
      this.doCreate(this.state.createFormData);
    }
  }

  doCreate(value) {
    ItrsUserApi.createUser(value,
      (success) => {
        if (success.success) {
          message.success('用户创建成功');
          this.onCreateFormClose();
          this.doQuery(this.props.form.getFieldsValue());
        } else {
          message.error('用户创建失败' + success.message);
        }
      },
      (fail) => {
        message.error('用户创建失败' + fail.message);
      }
    );
  }
  doModify(value) {
    ItrsUserApi.modifyUser(value,
      (success) => {
        if (success.success) {
          message.success('用户创建成功');
          this.onCreateFormClose();
          this.doQuery(this.props.form.getFieldsValue());
        } else {
          message.error('用户创建失败' + success.message);
        }
      },
      (fail) => {
        message.error('用户创建失败' + fail.message);
      }
    );
  }

  // =--------- 新增与修改 end ----------=

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
      <div className="user-page">
        <Form className="user-search-form" onSubmit={ this.onFormSearch }>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="用户名 " {...formItemLayout}>
                { getFieldDecorator('userName', {})(<Input />) }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="真实姓名 " {...formItemLayout}>
                { getFieldDecorator('realName', {})(<Input />) }
              </Form.Item>
            </Col>
            {/* <Col span={6}>
              <Form.Item label="部门 " {...formItemLayout}>
                { getFieldDecorator('departmentNameId',
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
            </Col> */}
            <Col span={6}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={ this.onFormReset }>重置</Button>
            </Col>
          </Row>
        </Form>
        <div className="button-container">
          <Button type="primary" onClick={ this.onCreateFormShow }>新增用户</Button>
        </div>
        <Spin spinning={ this.state.loadingUser } >
          <Table columns={ [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
          }, {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
          }, {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
          }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
          }, {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
          }, {
            title: '修改时间',
            dataIndex: 'gmtModify',
            key: 'gmtModify',
          }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span className="operations">
                <a>重置密码</a>
                <a onClick={ () => this.setState({ isEdit: true, showCreateModal: true, createFormData: record }) }>修改</a>
                <a>删除</a>
              </span>
            ),
          }] }
          rowKey="id"
          dataSource={ this.state.dataSource }
          pagination={ this.state.pagination }
          onChange={ (c) => this.onPageChange(c.current) }
          />
        </Spin>
        <Modal
          title={ this.state.isEdit ? '修改用户' : '新增用户' }
          visible={ this.state.showCreateModal }
          onOk={ this.onCreateFormSubmit }
          onCancel={ this.onCreateFormClose }
        >
          <UserCreateForm onChange={ this.onCreateFormChange } formData={ this.createFormData } />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UserPage);
