import React from 'react';
import { Spin, Table, message } from 'antd';
import { CandidateDetailForm } from './component';
import { ItrsFlowApi, ItrsDemandApi, ItrsCandidateApi } from '../../api/ItrsApi';

class FollowingDemandPage extends React.Component {
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
    // 初始化table列表
    this.handlePageChange(1);
  }

  doFollowingDemandApplyFlowQuery = function(values) {
    this.setState({ requesting: true });
    ItrsDemandApi.getFollowingDemand(values,
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

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doFollowingDemandApplyFlowQuery(values);
  }

  render() {
    const data = this.state.datas;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <FollowingDemandList requesting={ this.state.requesting }
      dataSource={ data }
      pagination={ pagination }
      onChange={ this.handlePageChange }
      confirm = { this.confirm }
      cancel = { this.cancel }
    />
    );
  }
}

class FollowingDemandList extends React.Component {
  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  state = {
    /* 被推荐人详情对话框 */
    candidate: {},
    showCandidateDetail: false
  }

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
        title: '发布HR',
        dataIndex: 'publisherName',
        key: 'publisherName',
      }, {
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
      }] }
      expandedRowRender={
        record => (
          <span>
            {
              <div>
                <MydemandFlowList
                  record={ record }
                  needUpdate={ true }
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
    ItrsFlowApi.getByDemandIdForManager(demandId,
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

export default FollowingDemandPage;