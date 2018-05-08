import React from 'react';
import { Spin, Table } from 'antd';
import { ItrsFlowApi } from '../../api/ItrsApi';

class IntervieweePage extends React.Component {

  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    datas: []
  }
  constructor(props) {
    super(props);
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

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doIntervieweeQuery(values);
  }

  render() {

    const data = this.state.datas;

    const pageSize = 1;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div className="interviewee-list-container">
        <IntervieweeList requesting={ this.state.requesting }
          dataSource={ data }
          pagination={ pagination }
          onChange={ this.handlePageChange }
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

  turnOperate(text) {
    let operateRes = [];
    let length = text.length;
    for (let i = 0; i < text.length; i++) {
      operateRes.push(<a>{ text[i] }</a>);
      operateRes.push(<span>　</span>);
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
              { this.turnOperate(text) }
              <a>被推荐人详情</a>
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

export default IntervieweePage;