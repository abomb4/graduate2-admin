import React from 'react';
import { Spin, Table } from 'antd';
import { ItrsFlowApi } from '../../api/ItrsApi';

class RecommendPage extends React.Component {

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
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doRecommendQuery = function(values) {
    console.log("doRecommendQuery");
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

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });
    console.log("handlePageChange");

    this.doRecommendQuery(values);
  }

  render() {
    console.log("render");

    const data = this.state.datas;
    console.log(data);

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div className="recommend-list-container">
        <RecommendList requesting={ this.state.requesting }
          dataSource={ data }
          pagination={ pagination }
          onChange={ this.handlePageChange }
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
    console.log("on list change");
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
    console.log("list render");
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