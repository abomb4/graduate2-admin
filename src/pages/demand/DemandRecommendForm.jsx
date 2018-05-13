
import React from 'react';
import { Form, Modal, Input, Select, Button, DatePicker, Upload, Icon, message } from 'antd';
import { ItrsFlowApi } from '../../api/ItrsApi';


class DemandRecommendForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const request = Object.assign({}, values);
        request.graduateTime = values.graduateTime.format('YYYY-MM-DD');
        request.attachment = values.attachment 
          ? values.attachment.fileList.filter(f => f.response).map(f => f.response.fileName).join(',')
          : null
        ;
        request.demandId = this.props.currentDemand.id;

        ItrsFlowApi.recommend(request,
          (success) => {
            message.success('推荐成功');
          },
          (fail) => {
            message.error('推荐提交失败，请稍后再试');
          }
        );
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentDemand } = this.props;

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

    return (
      <Modal
        maskClosable={ false }
        title={ this.props.title }
        visible={ this.props.visible }
        onOk={ this.handleSubmit }
        onCancel={ this.props.onCancel }
        okText="推荐"
        cancelText="取消"
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label="推荐岗位"
          >
            <Input disabled value={ currentDemand ? currentDemand.jobName : null } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="被推荐人姓名"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入被推荐人姓名!',
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('sex', {
              initialValue: '1',
              rules: [{
                required: true, message: '请选择被推荐人性别!',
              }],
            })(
              <Select>
                <Select.Option value="1">男</Select.Option>
                <Select.Option value="2">女</Select.Option>
                <Select.Option value="0">未知</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phoneNo', {
              rules: [{ required: true, message: '请填写被推荐人有效手机号！' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'E-mail 格式错误',
              }, {
                required: true, message: '请填写被推荐人有效 E-mail!',
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="毕业时间"
          >
            {getFieldDecorator('graduateTime', {
              rules: [{
                type: 'object', required: true, message: '请填写被推荐人毕业时间!',
              }],
            })(
              <DatePicker placeholder="请选择毕业日期" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="最高学位"
          >
            {getFieldDecorator('degree', {})(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="期望工作地点"
          >
            {getFieldDecorator('workingPlace', {
              initialValue: '杭州',
            })(
              <Select>
                <Select.Option value="杭州">杭州</Select.Option>
                <Select.Option value="南昌">南昌</Select.Option>
                <Select.Option value="舟山">舟山</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('memo', {})(
              <Input.TextArea />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="上传附件"
          >
            {getFieldDecorator('attachment', {})(
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
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(DemandRecommendForm);
