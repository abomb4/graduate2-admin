import React from 'react';
import { Form, Modal, Input } from 'antd';
import { makeDownloadUrl } from '../../../api/ItrsApi';

/**
 * 被推荐人信息详情
 */
class CandidateDetailForm extends React.Component {
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
    const { candidate } = this.props;
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
        maskClosable={ true }
        title={ this.props.title }
        visible={ this.props.visible }
        onOk={ this.props.onCancel }
        onCancel={ this.props.onCancel }
        okText="确定"
        cancelText="关闭"
      >
        <Form className="candidate-detail-form">
          <Form.Item
            {...formItemLayout}
            label="姓名"
          >
            <Input disabled value={ candidate.name } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="性别"
          >
            <Input disabled value={ this.changeSex(candidate.sex) } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="手机号"
          >
            <Input disabled value={ candidate.phoneNo } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="E-mail"
          >
            <Input disabled value={ candidate.email } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="毕业时间"
          >
            <Input disabled value={ candidate.graduateTime } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="最高学位"
          >
            <Input disabled value={ candidate.degree } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="期望工作地点"
          >
            <Input disabled value={ candidate.workingPlace } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            <Input disabled value={ candidate.memo } />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="附件"
          >
            {
              candidate.attachment ?
                candidate.attachment.split(',').map(fileName => <a className="link" key={ fileName } href={ makeDownloadUrl(fileName) } target="_blank">{ fileName }</a>)
                : null
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CandidateDetailForm;