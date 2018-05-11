import React from 'react';
import { Spin, Table, Form, Modal, Input, Popconfirm, message } from 'antd';
import { ItrsFlowApi, ItrsDemandApi, ItrsCandidateApi } from '../../api/ItrsApi';

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
      <div className="mydemand-list-container">
        <MydemandList requesting={ this.state.requesting }
          dataSource={ data }
          pagination={ pagination }
          onChange={ this.handlePageChange }
          confirm = { this.confirm }
          cancel = { this.cancel }
        />
      </div>
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
    showCandidateDetail: false,
    candidate: {}
  }

  // 弹出被推荐人详情框
  onCandidateDialogOpen = function(record) {
    this.doCandidateQuery(record['candidateId']);
    this.setState({
      showCandidateDetail: true
    });
  }.bind(this);

  // 关闭被推荐人详情框
  onCandidateDialogClose = function() {
    this.setState({ showCandidateDetail: false });
  }.bind(this);

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
                    onCandidateDialogOpen = { this.onCandidateDialogOpen }
                  />
                  <CandidateDetailForm
                    title="被推荐人详情"
                    visible={ this.state.showCandidateDetail }
                    onCancel={ this.onCandidateDialogClose }
                    candidate = { this.state.candidate }
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

  handleChange(demandId) {
    this.doFlowListQuery(demandId);
  }

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
        operateRes.push();
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

export default MydemandPage;