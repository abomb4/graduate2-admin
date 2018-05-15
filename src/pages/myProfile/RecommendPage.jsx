import React from 'react';
import { Spin, Table } from 'antd';
import { CandidateDetailForm } from './component';
import { ItrsFlowApi, ItrsCandidateApi } from '../../api/ItrsApi';

class RecommendPage extends React.Component {

  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    datas: [],
    showCandidateDetail: false,
    candidate: {}
  }

  componentDidMount() {
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doRecommendQuery = function(values) {
    this.setState({ requesting: true });
    ItrsFlowApi.listRecommenders(values,
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
    );
  }.bind(this);

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doRecommendQuery(values);
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

  render() {

    const data = this.state.datas;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div>
        <div className="recommend-list-container">
          <RecommendList requesting={ this.state.requesting }
            onCandidateDialogOpen = { this.onCandidateDialogOpen }
            dataSource={ data }
            pagination={ pagination }
            onChange={ this.handlePageChange }
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
 * 被推荐人结果列表
 */
class RecommendList extends React.Component {
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
          title: '当前流程节点',
          dataIndex: 'currentFlowNode',
          key: 'currentFlowNode',
        }, {
          title: '当前处理人',
          dataIndex: 'currentDealer',
          key: 'currentDealer',
        }, {
          title: '当前流程结果',
          dataIndex: 'currentResult',
          key: 'currentResult',
        }, {
          title: '流程状态',
          dataIndex: 'flowStatusName',
          key: 'flowStatusName',
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
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        onChange={ this.onPageChange }
        />
      </Spin>
    );
  }
}

export default RecommendPage;