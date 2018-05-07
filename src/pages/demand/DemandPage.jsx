import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Form, Row, Col,
  Table, Input, Select,
  Button, Icon, Radio,
  Spin, Modal, DatePicker,
  Upload, message
} from 'antd';
import './DemandPage.css';
import { ItrsDictionaryApi, ItrsDemandApi, ItrsFlowApi } from '../../api/ItrsApi';
import { loginActions } from '../../_actions';
import { LinkUtils } from '../../utils';

const { Component } = React;

/**
 * 搜索框
 */
class DemandQueryForm extends Component {

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
    
    const positionType = getFieldValue('positionType');

    if (this.props.positionTypeRootList.length <= 0) {
      // 列表里没数据
      currentRootPositionId = '';
      currentSubPositionId = '';
      rootList = [];
      subList = [];
    } else {
      // 列表有数据

      if (!positionType) {
        // 接口有返回职位列表，但没返回当前职位类型
        // 取跟职位类型第一个作为根类型
        currentRootPositionId = '';
        currentSubPositionId = currentRootPositionId;
      } else {
        // 根据当前职位类别找到根和子
        const currentPositionElement = this.props.positionTypeMap[positionType];
        if (currentPositionElement.parentId === undefined || currentPositionElement.parentId === 0) {
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

      rootList = [];
      rootList.push(<Radio.Button key="all" value={ '' }>全部</Radio.Button>);
      this.props.positionTypeRootList.forEach(root =>
        rootList.push(<Radio.Button key={ root.id } value={ root.id }>{ root.chineseName }</Radio.Button>)
      );

      subList = [];
      subList.push(<Radio.Button key={ currentRootPositionId } value={ currentRootPositionId }>全部</Radio.Button>);
      if (currentRootPositionId !== '') {
        const currentRootPositionElement = this.props.positionTypeMap[currentRootPositionId];
        currentRootPositionElement.subTypes.forEach(sub => {
          subList.push(<Radio.Button key={ sub.id + '' } value={ sub.id + '' }>{ sub.chineseName }</Radio.Button>);
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
    const { positionType } = urlParameters;

    if (!this.state.inited) {
      this.props.form.setFieldsValue({ positionType: positionType });
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

const WrappedDemandQueryForm = withRouter(DemandQueryForm);

class DemandRecommendForm extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const request = Object.assign({}, values);
        request.graduateTime = values.graduateTime.format('YYYY-MM-DD');
        request.attachment = values.attachment 
          ? values.attachment.fileList.filter(f => f.response).map(f => f.response.fileName).join(',')
          : null
        ;
        request.demandId = this.props.currentDemand.id;
        console.log('PackagedRequest: ', request);

        ItrsFlowApi.recommend(request,
          (success) => {
            message.success('推荐成功');
          },
          (fail) => {
            message.error('推荐提交失败，请稍后再试');
          }
        );
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentDemand } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        maskClosable={ false }
        title={ this.props.title }
        visible={ this.props.visible }
        onOk={ this.handleSubmit }
        onCancel={ this.props.onCancel }
        okText="推荐"
        cancelText="取消"
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label="推荐岗位"
          >
            <Input disabled value={ currentDemand ? currentDemand.jobName : null } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="被推荐人姓名"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入被推荐人姓名!',
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('sex', {
              initialValue: '1',
              rules: [{
                required: true, message: '请选择被推荐人性别!',
              }],
            })(
              <Select>
                <Select.Option value="1">男</Select.Option>
                <Select.Option value="2">女</Select.Option>
                <Select.Option value="0">未知</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phoneNo', {
              rules: [{ required: true, message: '请填写被推荐人有效手机号！' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'E-mail 格式错误',
              }, {
                required: true, message: '请填写被推荐人有效 E-mail!',
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="毕业时间"
          >
            {getFieldDecorator('graduateTime', {
              rules: [{
                type: 'object', required: true, message: '请填写被推荐人毕业时间!',
              }],
            })(
              <DatePicker placeholder="请选择毕业日期" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="最高学位"
          >
            {getFieldDecorator('degree', {})(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="期望工作地点"
          >
            {getFieldDecorator('workingPlace', {
              initialValue: '杭州',
            })(
              <Select>
                <Select.Option value="杭州">杭州</Select.Option>
                <Select.Option value="南昌">南昌</Select.Option>
                <Select.Option value="舟山">舟山</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('memo', {})(
              <Input.TextArea />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="上传附件"
          >
            {getFieldDecorator('attachment', {})(
              <Upload
                name='file'
                action={ ItrsFlowApi.UPLOAD_PATH }
                onChange={ function(info) {
                  info.file.name = info.file.originFileObj.name;

                  if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                  }
                  if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                  }
                }
                }>
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const FormWrappedRecommandForm = Form.create({})(DemandRecommendForm);

/**
 * 结果列表
 */
class DemandList extends Component {

  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  render() {
    const { onRecommendDialogOpen } = this.props;

    return (
      <Spin spinning={ this.props.requesting } >
        <Table columns={ [{
          title: '职位',
          dataIndex: 'jobName',
          key: 'jobName',
        }, {
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        }, {
          title: '招聘人数',
          dataIndex: 'total',
          key: 'total',
        }, {
          title: '工作地点',
          dataIndex: 'workingPlace',
          key: 'workingPlace',
        }, {
          title: '招聘HR',
          dataIndex: 'hrName',
          key: 'hrName',
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a onClick={ () => onRecommendDialogOpen(record) }>推荐</a>
              <span>　　　</span>
              <a href="" className="ant-dropdown-link"><Icon type="down" /></a>
            </span>
          ),
        }] }
        rowKey="id"
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        onChange={ this.onPageChange }
        />
      </Spin>
    );
  }
}

class DemandPage extends Component {

  state = {
    positionTypeMap: {},
    positionTypeRootList: [],
    positionTypeInited: false,
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    showRecommend: false,
    datas: []
  }
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.onRecommendDialogOpen = this.onRecommendDialogOpen.bind(this);
    this.onRecommendDialogClose = this.onRecommendDialogClose.bind(this);
  }

  componentDidMount() {

    this.initPositionTypes();
    this.handleSearch();
  }

  initPositionTypes() {
    if (this.state.positionTypeInited === true) {
      return;
    }

    const positionTypeMap = {};
    const positionTypeRootList = [];

    // 在页面加载时，初始化职位类别。
    // 职位类别没初始化之前，不能进行需求查询。
    ItrsDictionaryApi.getPositions(
      (success) => {
        if (success.success) {
          for (var i in success.data) {
            var position = success.data[i];
            positionTypeMap[position.id] = position;
            positionTypeRootList.push(position);

            // 子节点也放入map
            if (position.subTypes !== undefined) {
              for (var j in position.subTypes) {
                const e = position.subTypes[j];
                e.parentId = position.id;
                positionTypeMap[e.id] = e;
              };
            }
          }

          this.setState({
            positionTypeMap: positionTypeMap,
            positionTypeRootList: positionTypeRootList,
            positionTypeInited: true,
          });
        }
      },
      (fail) => {}
    );
  }

  doDemandQuery = function(values) {
    this.setState({ requesting: true });
    ItrsDemandApi.list(values,
      (success) => {
        this.setState({
          pagination: {
            pageNo: values.pageNo,
            pageSize: values.pageSize,
            total: success.total
          },
          datas: success.datas,
          requesting: false
        });
      },
      (fail) => {
        this.setState({ requesting: false });DemandQueryForm
      }
    );
  }.bind(this);

  handleSearch = function() {
    const queryData = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo: 1, pageSize }, queryData);

    this.doDemandQuery(values);
  }.bind(this)

  handlePageChange(pageNo) {
    const queryData = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize }, queryData);

    this.doDemandQuery(values);
  }

  onRecommendDialogOpen(demand) {
    const { dispatch } = this.props;

    if (!this.props.loginUser) {
      message.info('您需要先登陆才能进行推荐', 3);
      loginActions.show()(dispatch);
    } else {
      this.setState({
        showRecommend: true,
        currentDemand: demand
      });
    }
  }

  onRecommendDialogClose() {
    this.setState({ showRecommend: false });
  }


  render() {
    const data = this.state.datas;

    const pageSize = 1;

    // TODO 分页点击之后，触发表单提交事件
    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div id='demand-page'>
        {<WrappedDemandQueryForm
          form={ this.props.form }
          pageSize={ pageSize }
          doSearch={ this.handleSearch }
          positionTypeMap={ this.state.positionTypeMap }
          positionTypeRootList={ this.state.positionTypeRootList }
        />
        }
        <div className='page-content demand-page-main'>
          <div className="demand-list-container">
            <DemandList requesting={ this.state.requesting }
              dataSource={ data }
              pagination={ pagination }
              onChange={ this.handlePageChange }
              onRecommendDialogOpen={ this.onRecommendDialogOpen }
              onRecommendDialogClose={ this.onRecommendDialogClose }
            />
          </div>
          <div className="demand-suggest-container">
            <div style={{ width: 300, height:340, background: 'red' }} >
            </div>
          </div>
        </div>
        <FormWrappedRecommandForm
          title="人员推荐"
          currentDemand={ this.state.currentDemand }
          visible={ this.state.showRecommend }
          onOk={ this.handleOk }
          onCancel={ this.onRecommendDialogClose }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.userReducer;

  return {
    loginUser: user
  };
}
export default connect(mapStateToProps)(withRouter(Form.create({})(DemandPage)));
