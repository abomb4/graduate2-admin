import React from 'react';
import { Spin, Table } from 'antd';
import { ItrsFlowApi } from '../../api/ItrsApi';

class HistoryPage extends React.Component {
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

  doHistoryQuery = function(values) {
    this.setState({ requesting: true });
    ItrsFlowApi.listHistoricFlow(values,
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

    this.doHistoryQuery(values);
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
      <div className="history-list-container">
        <HistoryList requesting={ this.state.requesting }
          dataSource={ data }
          pagination={ pagination }
          onChange={ this.handlePageChange }
        />
      </div>
    );
  }
}

/**
 * 当前用户的历史处理记录结果列表
 */
class HistoryList extends React.Component {
  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  render() {
    return (
      <Spin spinning={ this.props.requesting } >
      <Table columns={ [{
        title: '处理节点',
        dataIndex: 'node',
        key: 'node',
      }, {
        title: '处理结果',
        dataIndex: 'result',
        key: 'result',
      }, {
        title: '处理开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
      }, {
        title: '处理结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
      }] }
      rowKey="taskId"
      dataSource={ this.props.dataSource }
      pagination={ this.props.pagination }
      onChange={ this.onPageChange }
      />
  </Spin>
    );
  }
}

export default HistoryPage;