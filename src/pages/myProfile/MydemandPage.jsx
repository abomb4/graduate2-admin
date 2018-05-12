import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import {
  Spin, Table, Form,
  Modal, Input, Popconfirm,
  message, Button, Row,
  Col, Cascader, Select,
  Radio
} from 'antd';
import { ItrsFlowApi, ItrsDemandApi, ItrsCandidateApi, ItrsDictionaryApi } from '../../api/ItrsApi';

class MydemandPage extends React.Component {
  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    datas: []
  }

  getLink(path) {
    const currentPath = this.props.match.path;
    return currentPath + path;
  }

  componentDidMount() {
    console.log('mount mydemandPage.');
    // 初始化table列表
    this.handlePageChange(1);
  }

  doMydemandApplyFlowQuery = function(values) {
    this.setState({ requesting: true });
    ItrsDemandApi.getMyDemand(values,
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
        this.setState({ requesting: false });
      }
    );
  }.bind(this);

  doDeleteDemand = function(id) {
    ItrsDemandApi.deleteDemand(id,
      (success) => {
        if (success.success) {
          message.success('停招该招聘需求成功!');
          // 重新渲染列表
          this.handlePageChange(1);
        } else {
          message.error('停招该招聘需求失败!');
          // 重新渲染列表
          this.handlePageChange(1);
        }
      },
      (fail) => {
        message.error('停招该招聘需求失败!');
        // 重新渲染列表
        this.handlePageChange(1);
      }
    );
  }.bind(this);

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doMydemandApplyFlowQuery(values);
  }

  // 气泡确认框confirm
  confirm = function(text, record) {
    this.doDeleteDemand(record['id']);
  }.bind(this);

  // 气泡确认框cancel
  cancel =  function(e) {
    message.error('取消停招该招聘需求!');
  }

  render() {
    const data = this.state.datas;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return(
      <Switch>
        <Route key="/new" path={ this.getLink('/new') } exact>
          <WrappedCreateDemandPage onFinish={() => this.handlePageChange(1)} />
        </Route>
        <Route key="/" path={ this.getLink('/') } exact>
          <div className="mydemand-list-container">
            <div className="button-container">
              <Button type="primary" onClick={ this.handleAddDemand }><Link to={ this.getLink('/new') }>新增招聘需求</Link></Button>
            </div>
            <MydemandList requesting={ this.state.requesting }
              dataSource={ data }
              pagination={ pagination }
              onChange={ this.handlePageChange }
              confirm = { this.confirm }
              cancel = { this.cancel }
            />
          </div>
        </Route>
      </Switch>
    );
  }
}

/**
 * 该用户发布的招聘需求结果列表
 */
class MydemandList extends React.Component {
  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  state = {
    candidate: {},
    showCandidateDetail: false,
    InductionStateModalVisible: false,
    InductionRecord: {},       // 录用上岗状态当行对应的数据
    InductionState: '拒绝录用',
    demandFlowListVersionMap: {},
  }

  // 在父组件发生render时进行调用
  // nextProps为新render过来的参数值
  // this.props.dataSource为旧的参数值
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      // 重建versionMap
      const newMap = {};
      // 对每一行进行version控制，通过version控制来更新数据
      for (const i in nextProps.dataSource) {
        const row = nextProps.dataSource[i];
        newMap[row.id] = 1;
      }
      this.setState({ demandFlowListVersionMap: newMap });
    }
  }

  dealInductionState = function(record, result) {
    const { id, taskId, demandId } = record;
    const values = Object.assign({id, taskId, result});
    console.log(values);

    // 调用流程处理API
    ItrsFlowApi.deal(values,
      (success) =>  {
        if (success.success) {
          message.success('录入上岗状态成功!');
          // 重新渲染列表
          const newMap = Object.assign({}, this.state.demandFlowListVersionMap);
          newMap[demandId] = newMap[demandId] + 1;
          this.setState({ demandFlowListVersionMap: newMap });
          console.log('newMap:', newMap);
          this.handleInductionStateModalCancel();
        } else {
          message.error('录入上岗状态成功失败!');
        }
      },
      (fail) =>  {
        message.error('录入上岗状态成功失败!');
      }
    );
  }.bind(this);

  /* 被推荐人详情框 start */
  // 弹出被推荐人详情框
  onCandidateDialogOpen = function(record, result) {
    this.doCandidateQuery(record['candidateId']);
    this.setState({
      showCandidateDetail: true
    });
  }.bind(this);

  // 关闭被推荐人详情框
  onCandidateDialogClose = function() {
    this.setState({ showCandidateDetail: false });
  }.bind(this);
  /* 被推荐人详情框 end */

  /* 录入上岗状态modal start */
  onInductionStateModalOpen = (record) => {
    this.setState({
      InductionRecord: record
    });
  }

  handleInductionStateModalOk = (e) => {
    console.log(this.state.InductionState);
    this.dealInductionState(this.state.InductionRecord, this.state.InductionState);
  }

  handleInductionStateModalCancel = (e) => {
    this.setState({
      InductionRecord: {}
    });
  }

  // modal中的radio变动
  onRadioChange = (e) => {
    this.setState({
      InductionState: e.target.value,
    });
  }
  /* 录入上岗状态modal end */

  // 根据被推荐人id查其详情
  doCandidateQuery = function(candidateId) {
    ItrsCandidateApi.getById(candidateId,
      (success) => {
        this.setState({
          candidate: success.data
        });
      },
      (fail) =>  {
        console.error(fail.message);
      }
    );
  }.bind(this);

  render() {
    return (
      <Spin spinning={ this.props.requesting } >
        <Table width= "20px" columns={ [{
          title: '职位',
          dataIndex: 'jobName',
          key: 'jobName',
        }, {
          title: '职位类别',
          dataIndex: 'positionTypeCnName',
          key: 'positionTypeCnName',
        }, {
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        }, {
          title: '招聘人数',
          dataIndex: 'total',
          key: 'total',
          render: (text, recored) => (
            <span>
              { text + '人' }
            </span>
          ),
        }, {
          title: '工作地点',
          dataIndex: 'workingPlace',
          key: 'workingPlace',
        }, {
          title: '需求状态',
          dataIndex: 'statusName',
          key: 'statusName',
        },/* {
        title: '职位描述',
        dataIndex: 'memo',
        key: 'memo',
        render: (text, record) => (
          <span className="mydemand-list-memo">
            { text }
          </span>
        ),
      },*/ {
          title: '发布日期',
          dataIndex: 'gmtCreate',
          key: 'gmtCreate',
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              { record['status'] === 1 ?
                <Popconfirm title="确定停招该招聘需求?" onConfirm={ () => this.props.confirm(text, record) } onCancel={ this.props.cancel } okText="确定" cancelText="取消">
                  <a>停招</a><span>&nbsp;&nbsp;&nbsp;</span>
                </Popconfirm> : ''
              }
              <a>修改</a><span>&nbsp;&nbsp;</span>
            </span>
          ),
        }] }
        expandedRowRender={
          record => (
            <span>
              {
                <div>
                  <MydemandFlowList
                    record={ record }
                    // 对展开下的记录进行version控制
                    version={ this.state.demandFlowListVersionMap[record.id] }
                    needUpdate={ true }
                    onCandidateDialogOpen = { this.onCandidateDialogOpen }
                    onInductionStateModalOpen = { this.onInductionStateModalOpen }
                  />
                  <CandidateDetailForm
                    title="被推荐人详情"
                    visible={ this.state.showCandidateDetail }
                    onCancel={ this.onCandidateDialogClose }
                    candidate = { this.state.candidate }
                  />
                  <InductionStateModal
                    visible={ this.state.InductionRecord.demandId === record.id }
                    handleOk={ this.handleInductionStateModalOk }
                    handleCancel={ this.handleInductionStateModalCancel }
                    onRadioChange={ this.onRadioChange }
                    InductionState={ this.state.InductionState }
                  />
                </div>
              }
            </span>
          )}
        rowKey="id"
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        onChange={ this.onPageChange }
        />
      </Spin>
    );
  }
}

class MydemandFlowList extends React.Component {

  state = {
    applyFlowList: [],
    requesting: false
  }

  componentDidMount() {
    this.handleChange(this.props.record['id']);
  }

  // 检查版本号，若不一致，则重新进行渲染
  componentWillReceiveProps(nextProps) {
    if (this.props.version !== nextProps.version) {
      this.handleChange(this.props.record['id']);
    }
  }

  // 查询该招聘需求id下的所有招聘流程列表
  doFlowListQuery = function(demandId) {
    this.setState({ requesting: true });
    ItrsFlowApi.getByDemandId(demandId,
      (success) => {
        this.setState({
          applyFlowList: success.datas,
          requesting: false
        });
      },
      (fail) => {
        this.setState({ requesting: false });
      },
    );
  }.bind(this);

  handleChange(demandId) {
    this.doFlowListQuery(demandId);
  }

  // 进行简历筛选通过or不通过操作
  dealPass = function(text, record, i) {
    const userAgent = JSON.parse(localStorage.getItem('user'));
    const nextUserId = userAgent['id'];
    const { id, taskId, taskName, demandId } = record;
    const outcome = text[i];
    const result = taskName + outcome;
    const values = Object.assign({id, nextUserId, taskId, taskName, outcome, result});
    console.log(values);

    // 调用流程处理API
    ItrsFlowApi.deal(values,
      (success) =>  {
        if (success.success) {
          message.success('给出结果成功!');
          // 重新渲染列表
          this.handleChange(demandId);
        } else {
          message.error('给出结果失败!');
          // 重新渲染列表
          this.handleChange(demandId);
        }
      },
      (fail) =>  {
        message.error('给出结果失败!');
        // 重新渲染列表
        this.handleChange(demandId);
      }
    );
  }.bind(this);

  // 通过or不通过
  confirmResult = function(text, record, i) {
    this.dealPass(text, record, i);
  }.bind(this);

  cancelResult =  function(e) {
    message.error('取消该结果!');
  }

  turnSex(text) {
    if (text === 1) {
      return '男';
    } else if (text === 2) {
      return '女';
    } else {
      return '未知';
    }
  }

  // 操作
  turnOperate(text, record) {
    let operateRes = [];
    for (let i = 0; i < text.length; i++) {
      // 防止key不唯一报错
      if (text[i] === '通过' || text[i] === '未通过') {
        // Popconfirm气泡确认框
        operateRes.push(
          <Popconfirm title="确定给出该结果?" onConfirm={ () => this.confirmResult(text, record, i) } onCancel={ this.cancelResult } okText="确定" cancelText="取消" key={ 2*i }>
            <a key={ 2*i }>{ text[i] }</a>
          </Popconfirm>);
      } else if (text[i] === '录入上岗状态') {
        operateRes.push(
          <a key={ 2*i } onClick={ () => this.props.onInductionStateModalOpen(record) }>{ text[i] }</a>
        );
      } else {
        operateRes.push(
          <a key={ 2*i }>{ text[i] }</a>
        );
      }
      operateRes.push(<span key={ 2*i+1 }>　</span>);
    }
    return operateRes;
  }

  render() {
    return(
      <Spin spinning={ this.state.requesting } >
        <Table columns={ [{
          title: '被推荐人姓名',
          dataIndex: 'candidateName',
          key: 'candidateName',
        }, {
          title: '被推荐人性别',
          dataIndex: 'candidateSex',
          key: 'candidateSex',
          render: (text, record) => (
            <span>{ this.turnSex(text) }</span>
          ),
        }, {
          title: '期望工作地点',
          dataIndex: 'hopeWorkingPlace',
          key: 'hopeWorkingPlace',
        }, {
          title: '推荐人姓名',
          dataIndex: 'recommendName',
          key: 'recommendName',
        }, {
          title: '当前流程节点',
          dataIndex: 'currentFlowNode',
          key: 'currentFlowNode',
        }, {
          title: '当前流程结果',
          dataIndex: 'currentResult',
          key: 'currentResult',
        }, {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          render: (text, record) => (
            <span>
              { this.turnOperate(text, record) }
              <a onClick={ () => this.props.onCandidateDialogOpen(record) }>被推荐人详情</a>
            </span>
          ),
        }] }
        rowKey="id"
        dataSource={ this.state.applyFlowList }
        pagination={false}
        />
      </Spin>
    );
  }
}

/**
 * 被推荐人信息详情
 */
class CandidateDetailForm extends React.Component {
  changeSex(text) {
    if (text === 1) {
      return '男';
    } else if (text === 2) {
      return '女';
    } else {
      return '未知';
    }
  }

  render() {
    const { candidate } = this.props;
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
        maskClosable={ true }
        title={ this.props.title }
        visible={ this.props.visible }
        onOk={ this.props.onCancel }
        onCancel={ this.props.onCancel }
        okText="确定"
        cancelText="关闭"
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="姓名"
          >
            <Input disabled value={ candidate.name } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="性别"
          >
            <Input disabled value={ this.changeSex(candidate.sex) } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="手机号"
          >
            <Input disabled value={ candidate.phoneNo } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="E-mail"
          >
            <Input disabled value={ candidate.email } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="毕业时间"
          >
            <Input disabled value={ candidate.graduateTime } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="最高学位"
          >
            <Input disabled value={ candidate.degree } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="期望工作地点"
          >
            <Input disabled value={ candidate.workingPlace } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            <Input disabled value={ candidate.memo } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="附件"
          >
            <Input disabled value={ candidate.attachment } />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

/**
 * 录入上岗状态modal，由radio组成
 */
class InductionStateModal extends React.Component {

  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        title="选择上岗状态"
        maskClosable={ true }
        visible={ this.props.visible }
        onOk={ this.props.handleOk }
        onCancel={ this.props.handleCancel }
        okText="选择"
        cancelText="取消"
      >
        <Radio.Group onChange={ this.props.onRadioChange } value={ this.props.InductionState }>
          <Radio style={ radioStyle } value={ '拒绝录用' } >拒绝录用</Radio>
          <Radio style={ radioStyle } value={ '已上岗' } >已上岗</Radio>
          <Radio style={ radioStyle } value={ '拒绝上岗' } >拒绝上岗</Radio>
          <Radio style={ radioStyle } value={ '因故未上岗' } >因故未上岗</Radio>
        </Radio.Group>
      </Modal>
    );
  }
}


class CreateDemandPage extends React.Component {

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    positionType: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const postParam = Object.assign({}, values);
        // 取最后元素
        postParam.positionType = postParam.positionType[postParam.positionType.length - 1];
        ItrsDemandApi.publishDemand(postParam,
          (success) => {
            message.success('需求发布成功');
            if (this.props.onFinish) {
              this.props.onFinish();
            }
            this.props.history.push('/myProfile/mydemand');
          },
          (fail) => {
            message.error('需求发布失败。' + fail.message);
          }
        );
      }
    });
  }
  componentWillMount() {
    // 初始化职位类别
    ItrsDictionaryApi.getPositions(
      (success) => {
        if (success.success) {
          const data = success.data.map(p => {
            let children;
            if (p.subTypes) {
              children = p.subTypes.map(sub => ({ value: sub.id, label: sub.chineseName }));
            } else {
              children = [];
            }
            return {
              value: p.id,
              label: p.chineseName,
              children: children
            };
          });
          this.setState({ positionType: data });
        }
      },
      (fail) => {}
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
    const tailformItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div className="demand-form-page">
        <h2 className="title">{ this.props.isEdit ? '修改需求' : '发布新需求' }</h2>
        <Row>
          <Col span={18}>
            <Form onSubmit={ this.handleSubmit }>
              <Form.Item
                {...formItemLayout}
                label="职位类别"
              >
                {getFieldDecorator('positionType', {
                  rules: [{
                    required: true, message: '请选择职位类别!',
                  }],
                })(
                  <Cascader options={ this.state.positionType } onChange={ (e) => console.log(e) } placeholder="请选择职位类别" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="岗位名称"
              >
                {getFieldDecorator('jobName', {
                  rules: [{
                    required: true, message: '请输入岗位名称!',
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="招聘总人数"
              >
                {getFieldDecorator('total', {
                  initialValue: 1,
                  rules: [{
                    required: true, message: '请输入招聘总人数!',
                  }],
                })(
                  <Input type="number" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="工作地点"
              >
                {getFieldDecorator('workingPlace', {
                  initialValue: '杭州',
                  rules: [{
                    required: true, message: '请选择工作地点!',
                  }],
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
                label="最低学位要求"
              >
                {getFieldDecorator('degreeRequest', { initialValue: '不限' })(
                  <Select>
                    <Select.Option value="不限">不限</Select.Option>
                    <Select.Option value="高中">高中</Select.Option>
                    <Select.Option value="大专">大专</Select.Option>
                    <Select.Option value="本科">本科</Select.Option>
                    <Select.Option value="硕士">硕士</Select.Option>
                    <Select.Option value="博士">博士</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="岗位说明"
              >
                {getFieldDecorator('memo', {})(
                  <Input.TextArea autosize={{ minRows: 6 }}/>
                )}
              </Form.Item>
              <Form.Item {...tailformItemLayout}>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedCreateDemandPage = withRouter(Form.create()(CreateDemandPage));

export default withRouter(MydemandPage);
