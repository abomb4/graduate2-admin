import React from 'react';
import { Spin, Table, Icon, Popconfirm, message } from 'antd';
import { ItrsDemandApi, ItrsDictionaryApi } from '../../api/ItrsApi';

class MydemandPage extends React.Component {
  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    positionTypeInited: false,
    positionTypeMap: {},
    datas: []
  }

  componentDidMount() {
    // 初始化职位类别map
    this.initPositionTypes();
  }

  doMydemandQuery = function(values) {
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
          message.success("下架该招聘需求成功!");
          // 重新渲染列表
          this.handlePageChange(1);
        } else {
          message.error("下架该招聘需求失败!");
          // 重新渲染列表
          this.handlePageChange(1);
        }
      },
      (fail) => {
        message.error("下架该招聘需求失败!");
        // 重新渲染列表
        this.handlePageChange(1);
      }
    );
  }.bind(this);

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doMydemandQuery(values);
  }

  initPositionTypes() {
    if (this.state.positionTypeInited === true) {
      return;
    }

    const positionTypeMap = {};


    // 在页面加载时，初始化职位类别。
    // 职位类别没初始化之前，不能进行招聘需求列表渲染。
    ItrsDictionaryApi.getPositions(
      (success) => {
        if (success.success) {
          for (var i in success.data) {
            var position = success.data[i];
            positionTypeMap[position.id] = position;

            // 子节点也放入map
            if (position.subTypes !== undefined) {
              for (var j in position.subTypes) {
                const e = position.subTypes[j];
                e.parentId = position.id;
                positionTypeMap[e.id] = e;
              };
            }
          }

          this.setState({
            positionTypeMap: positionTypeMap,
            positionTypeInited: true,
          });
        }
        // 初始化table列表，否则由于异步，职位类别无法进行解析
        this.handlePageChange(1);
      },
      (fail) => {}
    );
  }

  // 气泡确认框confirm
  confirm = function(text, record) {
    this.doDeleteDemand(record['id']);
  }.bind(this);
  
  // 气泡确认框cancel
  cancel =  function(e) {
    message.error('取消下架该招聘需求!');
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
          positionTypeMap={ this.state.positionTypeMap }
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
  render() {
    return (
    <Spin spinning={ this.props.requesting } >
      <Table columns={ [{
        title: '职位',
        dataIndex: 'jobName',
        key: 'jobName',
      }, {
        title: '职位类别',
        dataIndex: 'positionType',
        key: 'positionType',
        render: (text, record) => (
          <span>
            { this.props.positionTypeMap[text].chineseName }
          </span>
        ),
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
        title: '需求状态',
        dataIndex: 'statusName',
        key: 'statusName',
      }, {
        title: '职位描述',
        dataIndex: 'memo',
        key: 'memo',
      }, {
        title: '发布日期',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            { record['status'] === 1 ? 
              <Popconfirm title="确定下架该招聘需求?" onConfirm={ () => this.props.confirm(text, record) } onCancel={ this.props.cancel } okText="确定" cancelText="取消">
                <a>下架</a><span>&nbsp;&nbsp;&nbsp;</span>
              </Popconfirm> : ''
            }
            <a>修改</a><span>&nbsp;&nbsp;</span>
            <a href="###" className="ant-dropdown-link"><Icon type="down" /></a>
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

export default MydemandPage;