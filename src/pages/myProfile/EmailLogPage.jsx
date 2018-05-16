import React from 'react';
import { Spin, Table } from 'antd';
import { ItrsEmailApi } from '../../api/ItrsApi';

class EmailLogPage extends React.Component{
  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0,
      onChange: this.handlePageChange.bind(this)
    },
    requesting: false,
    datas: []
  }

  componentDidMount() {
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doEmailLogQuery = function(values) {
    this.setState({ requesting: true });
    ItrsEmailApi.listEmailLog(values,
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

    this.doEmailLogQuery(values);
  }

  render() {
    return(
      <div className="emailLog-list-container">
        <EmailLogList requesting={ this.state.requesting }
          dataSource={ this.state.datas }
          pagination={ this.state.pagination }
        />
      </div>
    );
  }
}

/**
 * 邮件日志结果列表
 */
class EmailLogList extends React.Component {

  render() {
    return (
      <Spin spinning={ this.props.requesting } >
      <Table columns={ [{
        title: '发送邮件地址',
        dataIndex: 'sendEmail',
        key: 'sendEmail',
      }, {
        title: '接收邮件地址',
        dataIndex: 'receiveEmail',
        key: 'receiveEmail',
      }, {
        title: '邮件内容',
        dataIndex: 'content',
        key: 'content',
      }, {
        title: '发送状态',
        dataIndex: 'simpleStatus',
        key: 'simpleStatus',
      }, {
        title: '发送时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      }] }
      rowKey="id"
      dataSource={ this.props.dataSource }
      pagination={ this.props.pagination }
      />
  </Spin>
    );
  }
}

export default EmailLogPage;