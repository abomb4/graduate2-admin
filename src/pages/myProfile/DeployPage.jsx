import React from 'react';
import { Spin, Table, Form, Button, Modal, Input, Upload, message, Icon } from 'antd';
import { ItrsFlowApi } from '../../api/ItrsApi';
import './MyProfilePage.css';

class DeployPage extends React.Component {
  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0,
      onChange: this.handlePageChange.bind(this)
    },
    requesting: false,
    deployModalVisible: false,
    datas: []
  }

  componentDidMount() {
    let pageNo = 1;
    this.handlePageChange(pageNo);
  }

  doDeployQuery = function(values) {
    this.setState({ requesting: true });
    ItrsFlowApi.listDeploy(values,
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

    this.doDeployQuery(values);
  }

  renderDeployList = function(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doDeployQuery(values);
  }.bind(this);

  /* 部署新流程对话框 start */ 
  onCreateDeployModalShow = function() {
    this.setState({
      deployModalVisible: true
    });
  }.bind(this);

  onCreateDeployModalCancel = function() {
    this.setState({
      deployModalVisible: false
    });
  }.bind(this);
  /* 部署新流程对话框 end */ 

  render() {
    return(
      <div className="deploy-list-container">
        <div className="button-container">
          <Button type="primary" onClick={ this.onCreateDeployModalShow }>部署新流程</Button>
        </div>
        <DeployList requesting={ this.state.requesting }
          dataSource={ this.state.datas }
          pagination={ this.state.pagination }
        />
        <CreateDeployModal
          visible={ this.state.deployModalVisible }
          onCancel={ this.onCreateDeployModalCancel }
          renderDeployList={ this.renderDeployList }
          form={ this.props.form }
        />
      </div>
    );
  }
}

/**
 * 流程部署信息结果列表
 */
class DeployList extends React.Component {

  render() {

    return (
      <Spin spinning={ this.props.requesting } >
        <Table columns={ [{
          title: '部署流程名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '部署流程key',
          dataIndex: 'key',
          key: 'key',
        }, {
          title: '部署时间',
          dataIndex: 'deploymentTime',
          key: 'deploymentTime',
        }] }
        rowKey="id"
        dataSource={ this.props.dataSource }
        pagination={ this.props.pagination }
        />
    </Spin>
    );
  }
}

/**
 * 部署新流程对话框
 */
class CreateDeployModal extends React.Component {

  handleDeploySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const request = Object.assign({}, values);
        console.log(values);
        request.zipName = values.zipFile 
          ? values.zipFile.fileList[0].name.split('.')[0]
          : null
        ;
        request.zipFile = null;

        ItrsFlowApi.deployZip(request,
          (success) => {
            if (success.success) {
              this.props.onCancel();
              // 重新渲染流程部署列表
              this.props.renderDeployList(1);
              message.success('部署流程成功!');
            } else {
              this.props.onCancel();
              message.error(success.message);
            }
          },
          (fail) => {
            this.props.onCancel();
            message.error('部署流程失败，请稍后再试!!!');
          }
        );
      }
    });
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
      <Modal
      maskClosable={ false }
      title='招聘流程部署'
      visible={ this.props.visible }
      onOk={ this.handleDeploySubmit }
      onCancel={ this.props.onCancel }
      okText="部署"
      cancelText="取消"
    >
      <Form onSubmit={this.handleDeploySubmit}>
        <Form.Item
          {...formItemLayout}
          label="部署流程名"
        >
          {getFieldDecorator('deployName', {
            rules: [{
              required: true, message: '请输入部署流程名!',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="上传附件"
        >
          {getFieldDecorator('zipFile', {
            rules: [{
              required: true, message: '请上传部署打包文件!',
            }],
          })(
            <Upload
              name='file'
              action={ ItrsFlowApi.UPLOAD_PATH }
              onChange={ function(info) {
                info.file.name = info.file.originFileObj.name;

                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`);
                }
              }
              }>
              <Button>
                <Icon type="upload" /> 上传部署打包文件
              </Button>
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
    );
  }
}

export default Form.create({})(DeployPage);;