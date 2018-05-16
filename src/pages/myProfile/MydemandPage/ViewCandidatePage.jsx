import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Spin, Table, Button, Row, Col, Input, Icon } from 'antd';
import { CandidateDetailForm } from '../component';
import { ItrsCandidateApi } from '../../../api/ItrsApi';
import './MydemandPage.css';


class CandidatePage extends React.Component {

  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0,
      onChange: this.handlePageChange.bind(this)  // pagination的点击
    },
    requesting: false,
    dataSource: [],
    showCandidateDetail: false,
    candidate: {}
  }

  componentDidMount() {
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doCandidateListQuery = function(values) {
    this.setState({ requesting: true });
    ItrsCandidateApi.list(values,
      (success) => {
        this.setState({
          pagination: {
            pageNo: values.pageNo,
            pageSize: values.pageSize,
            total: success.total
          },
          dataSource: success.datas,
          requesting: false
        });
      },
      (fail) => {
        this.setState({ requesting: false });
      }
    );
  }.bind(this);

  handlePageChange(pageNo) {
    const formValues = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize }, formValues);

    this.doCandidateListQuery(values);
  }

  /* 被推荐人详情框 start */
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

  // 弹出被推荐人详情框
  onCandidateDialogOpen = function(record) {
    this.doCandidateQuery(record['id']);
    this.setState({
      showCandidateDetail: true
    });
  }.bind(this);

  // 关闭被推荐人详情框
  onCandidateDialogClose = function() {
    this.setState({ showCandidateDetail: false });
  }.bind(this);
  /* 被推荐人详情框 end */


  // =------- 列表搜索相关 ---------=
  // 重置
  onFormReset = () => {
    this.props.form.resetFields();
  }

  // search
  onFormSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handlePageChange(1);
      }
    });
  }

  // =------- 列表搜索相关 end ---------=
  
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

    const { getFieldDecorator } = this.props.form;
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

    return(
      <div className="candidate-page">
        <Button type="warning" onClick={ () => this.props.history.goBack() }><Icon type="left" />返回</Button>
        <Form className="candidate-search-form" onSubmit={ this.onFormSearch }>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="人才姓名 " {...formItemLayout}>
                { getFieldDecorator('name', {})(<Input />) }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="期望工作地点 " {...formItemLayout}>
                { getFieldDecorator('workingPlace', {})(<Input />) }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={ this.onFormReset }>重置</Button>
            </Col>
          </Row>
        </Form>
        <Spin spinning={ this.state.requesting } >
          <Table columns={ [{
            title: '人才姓名',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: (text, record) => (
              <span>{ this.changeSex(text) }</span>
            ),
          }, {
            title: '手机号',
            dataIndex: 'phoneNo',
            key: 'phoneNo',
          }, {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
          }, {
            title: '毕业时间',
            dataIndex: 'graduateTime',
            key: 'graduateTime',
          }, {
            title: '最高学位',
            dataIndex: 'degree',
            key: 'degree',
          }, {
            title: '期望工作地点',
            dataIndex: 'workingPlace',
            key: 'workingPlace',
          }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span className="operations">
                <a onClick={ () => this.onCandidateDialogOpen(record) }>被推荐人详情</a>
              </span>
            ),
          }] }
          rowKey="id"
          dataSource={ this.state.dataSource }
          pagination={ this.state.pagination }
          />
        </Spin>
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

const WrappedViewCandidatePage = withRouter(Form.create()(CandidatePage));

export default WrappedViewCandidatePage;