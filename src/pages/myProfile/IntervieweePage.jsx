import React from 'react';
import { Spin, Table, Form, Modal, Input, Popconfirm, message } from 'antd';
import { ItrsFlowApi, ItrsCandidateApi } from '../../api/ItrsApi';

class IntervieweePage extends React.Component {

  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    showCandidateDetail: false,
    datas: [],
    candidate: {}
  }

  // 组件挂载
  componentDidMount() {
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doIntervieweeQuery = function(values) {
    this.setState({ requesting: true });
    ItrsFlowApi.needInterview(values,
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
      )
  }.bind(this);

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doIntervieweeQuery(values);
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

  // 处理流程，这里为给出面试结果
  dealInterview = function(text, record, i) {
    const { id, publisherId, taskId, taskName } = record;
    const nextUserId = publisherId;
    const outcome = text[i];
    const result = taskName + outcome;
    const values = Object.assign({id, nextUserId, taskId, taskName, outcome, result});
    console.log(values);

    // 调用流程处理API
    ItrsFlowApi.deal(values,
      (success) =>  {
        if (success.success) {
          message.success("给出面试结果成功!");
          // 重新渲染列表
          this.handlePageChange(1);
        } else {
          message.error("给出面试结果失败!");
          // 重新渲染列表
          this.handlePageChange(1);
        }
      },
      (fail) =>  {
        message.error("给出面试结果失败!");
        // 重新渲染列表
        this.handlePageChange(1);
      }
    );
  }.bind(this);

  // 气泡确认框confirm
  confirm = function(text, record, i) {
    this.dealInterview(text, record, i);
    // message.success('确定给出面试结果!');
  }.bind(this);
  
  // 气泡确认框cancel
  cancel =  function(e) {
    message.error('取消给出面试结果!');
  }

  render() {

    const data = this.state.datas;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    // console.log(this.state);

    return (
      <div>
        <div className="interviewee-list-container">
          <IntervieweeList requesting={ this.state.requesting }
            dataSource={ data }
            pagination={ pagination }
            onChange={ this.handlePageChange }
            onCandidateDialogOpen = { this.onCandidateDialogOpen }
            dealInterview = { this.dealInterview }
            confirm = { this.confirm }
            cancel = { this.cancel }
          />
        </div>
        <CandidateDetailForm
          title="被推荐人详情"
          visible={ this.state.showCandidateDetail }
          onCancel={ this.onCandidateDialogClose }
          candidate = { this.state.candidate }
        />
      </div>
    );
  }
}

/**
 * 需要面试结果列表
 */
class IntervieweeList extends React.Component {
  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  turnSex(text) {
    if (text === 1) {
      return '男';
    } else if (text === 2) {
      return '女';
    } else {
      return '未知';
    }
  }

  // 操作： 通过、未通过
  turnOperate(text, record) {
    let operateRes = [];
    for (let i = 0; i < text.length; i++) {
      // 防止key不唯一报错
      // Popconfirm气泡确认框
      operateRes.push(
        <Popconfirm title="确定给出该面试结果?" onConfirm={ () => this.props.confirm(text, record, i) } onCancel={ this.props.cancel } okText="确定" cancelText="取消" key={ 2*i }>
          <a key={ 2*i }>{ text[i] }</a>
        </Popconfirm>
      );
      operateRes.push(<span key={ 2*i+1 }>　</span>);
    }
    return operateRes;
  }

  render() {
    return (
      <Spin spinning={ this.props.requesting } >
        <Table columns={ [{
          title: '姓名',
          dataIndex: 'candidateName',
          key: 'candidateName',
        }, {
          title: '性别',
          dataIndex: 'candidateSex',
          key: 'candidateSex',
          render: (text, record) => (
            <span>{ this.turnSex(text) }</span>
          ),
        }, {
          title: '岗位',
          dataIndex: 'jobName',
          key: 'jobName',
        }, {
          title: '职位类别',
          dataIndex: 'positionTypeCnName',
          key: 'positionTypeCnName',
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
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        onChange={ this.onPageChange }
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

export default IntervieweePage;