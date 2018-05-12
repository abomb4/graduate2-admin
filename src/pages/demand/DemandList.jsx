import React from 'react';
import { Spin, Table } from 'antd';

/**
 * 结果列表
 */
export default class DemandList extends React.Component {

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
          dataIndex: 'publisherName',
          key: 'publisherName',
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a onClick={ () => onRecommendDialogOpen(record) }>推荐</a>
            </span>
          ),
        }] }
        expandedRowRender={ record => <p style={{ margin: 0 }}>{
          record.memo.split('\n').map(function(item) {
            return (
              <span key={ item }>{ item } <br></br></span>
            );
          })
        }</p>}
        rowKey="id"
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        onChange={ this.onPageChange }
        />
      </Spin>
    );
  }
}
