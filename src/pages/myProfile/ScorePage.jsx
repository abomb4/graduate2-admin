import React from 'react';
import { Spin, Table } from 'antd';
import { ItrsScoreApi } from '../../api/ItrsApi';

class ScorePage extends React.Component {

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

  // 分页查询用户积分流水变动记录
  doScoreListQuery = function(values) {
    this.setState({ requesting: true });
    ItrsScoreApi.getScoreList(values,
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

    this.doScoreListQuery(values);
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
      <div className="recommend-list-container">
        <ScoreList requesting={ this.state.requesting }
          dataSource={ data }
          pagination={ pagination }
          onChange={ this.handlePageChange }
        />
      </div>
    );
  }
}

/**
 * 用户积分变动流水记录列表
 */
class ScoreList extends React.Component {
  onPageChange = function(pagination) {
    if (this.props.onPageChange) {
      this.props.onPageChange(pagination);
    }
  }.bind(this);

  render() {
    return(
      <Spin spinning={ this.props.requesting } >
        <Table columns={ [{
          title: '积分变动',
          dataIndex: 'score',
          key: 'score',
          render: (text, record) => (
            <span>{ text + '分' }</span>
          ),
        }, {
          title: '变动原因',
          dataIndex: 'memo',
          key: 'memo',
        }, {
          title: '积分变动时间',
          dataIndex: 'gmtCreate',
          key: 'gmtCreate',
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

export default ScorePage;