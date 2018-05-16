
import React from 'react';
import { withRouter } from 'react-router-dom';
import { message, Form, Input, Row, Button, Col, Cascader, Select, Icon, Spin } from 'antd';
import { ItrsDemandApi, ItrsDictionaryApi } from '../../../api/ItrsApi';

class CreateDemandPage extends React.Component {

  state = {
    positionTypeMap: {},
    positionType: [],
    positionTypeInited: false,
    editRecord: {},
    procKeyList: [],
    editLoading: false,
    editInited: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const postParam = Object.assign({}, values);
        if (this.props.isEdit) {
          this.submitEdit(postParam);
        } else {
          this.submitCreate(postParam);
        }
      }
    });
  }

  submitCreate(postParam) {
    // 取最后元素
    postParam.positionType = postParam.positionType[postParam.positionType.length - 1];
    ItrsDemandApi.publishDemand(postParam,
      (success) => {
        message.success('需求发布成功');
        if (this.props.onFinish) {
          this.props.onFinish();
        }
        this.props.history.push('/myProfile/mydemand');
      },
      (fail) => {
        message.error('需求发布失败。' + fail.message);
      }
    );
  }

  submitEdit(values) {
    const postParam = Object.assign({
      id: this.state.editRecord.id
    }, values);
    postParam.positionType = postParam.positionType[postParam.positionType.length - 1];

    ItrsDemandApi.updateDemand(postParam,
      (success) => {
        if (success.success) {
          message.success('需求修改成功');
        } else {
          message.error(success.message);
        }
        if (this.props.onFinish) {
          this.props.onFinish();
        }
        this.props.history.push('/myProfile/mydemand');
      },
      (fail) => {
        message.error('需求修改失败。' + fail.message);
      }
    );
  }

  componentWillMount() {
    // 初始化职位类别
    ItrsDictionaryApi.getPositions(
      (success) => {
        if (success.success) {
          const map = {};
          const data = success.data.map(p => {
            map[p.id] = p;

            let children;
            if (p.subTypes) {
              children = p.subTypes.map(sub => {
                const theSub = Object.assign({ parentId: p.id }, sub);
                map[sub.id] = theSub;

                return { value: sub.id, label: sub.chineseName };
              });
            } else {
              children = [];
            }
            return {
              value: p.id,
              label: p.chineseName,
              children: children
            };
          });
          this.setState({
            positionType: data,
            positionTypeInited: true,
            positionTypeMap: map
          });
          if (this.props.isEdit) {
            this.initEditForm();
          }
        }
      },
      (fail) => {}
    );

    // 初始化流程部署列表
    ItrsDictionaryApi.getProcKeyList(
      (success) => {
        const procKeyList = success.data;
        this.setState({
          procKeyList: procKeyList
        });
      },
      (fail) => {}
    );

    // edit?
    if (this.props.isEdit === true) {
      this.setState({ editLoading: true });
      const { id } = this.props.match.params;
      ItrsDemandApi.getById(
        id,
        (success) => {
          if (success.success) {
            const data = success.data;
            this.setState({
              editRecord: data,
              editInited: true,
            });
            this.initEditForm();
          } else {
            const the = success.message ? success.message + '，' : '';
            message.error('加载需求信息失败，' + the + '请尝试刷新页面');
          }
        },
        (fail) => {
          console.debug(fail);
          message.error('加载需求信息失败，请尝试刷新页面');
        }
      );
    }
  }

  initEditForm() {
    const { positionTypeInited, editInited, positionTypeMap, editRecord } = this.state;

    if (editInited && positionTypeInited) {
      const currentType = positionTypeMap[editRecord.positionType];
      if (!currentType) {
        this.props.form.setFieldsValue({
          positionType: [],
          jobName: editRecord.jobName,
          total: editRecord.total,
          workingPlace: editRecord.workingPlace,
          degreeRequest: editRecord.degreeRequest,
          memo: editRecord.memo,
          procKey: editRecord.procKey
        });
        this.setState({
          editLoading: false
        });
      } else {
        let positionTypeArray;
        if (currentType.parentId) {
          positionTypeArray = [ currentType.parentId, editRecord.positionType ];
        } else {
          positionTypeArray = [ editRecord.positionType ];
        }

        this.props.form.setFieldsValue({
          positionType: positionTypeArray,
          jobName: editRecord.jobName,
          total: editRecord.total,
          workingPlace: editRecord.workingPlace,
          degreeRequest: editRecord.degreeRequest,
          memo: editRecord.memo,
          procKey: editRecord.procKey
        });
        this.setState({
          editLoading: false
        });
      }
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
    const tailformItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className="demand-form-page">
        <div className="header">
          <h2 className="title">{ this.props.isEdit ? '修改需求' : '发布新需求' }</h2>
          <Button type="warning" onClick={ () => this.props.history.goBack() }><Icon type="left" />返回</Button>
        </div>
        <Row>
          <Col span={18}>
            <Spin spinning={ this.state.editLoading }>
              <Form onSubmit={ this.handleSubmit }>
                <Form.Item
                  {...formItemLayout}
                  label="职位类别"
                >
                  {getFieldDecorator('positionType', {
                    rules: [{
                      required: true, message: '请选择职位类别!',
                    }],
                  })(
                    <Cascader options={ this.state.positionType } placeholder="请选择职位类别" />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="岗位名称"
                >
                  {getFieldDecorator('jobName', {
                    rules: [{
                      required: true, message: '请输入岗位名称!',
                    }],
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="招聘总人数"
                >
                  {getFieldDecorator('total', {
                    initialValue: 1,
                    rules: [{
                      required: true, message: '请输入招聘总人数!',
                    }],
                  })(
                    <Input type="number" />
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="工作地点"
                >
                  {getFieldDecorator('workingPlace', {
                    initialValue: '杭州',
                    rules: [{
                      required: true, message: '请选择工作地点!',
                    }],
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
                  label="最低学位要求"
                >
                  {getFieldDecorator('degreeRequest', { initialValue: '不限' })(
                    <Select>
                      <Select.Option value="不限">不限</Select.Option>
                      <Select.Option value="高中">高中</Select.Option>
                      <Select.Option value="大专">大专</Select.Option>
                      <Select.Option value="本科">本科</Select.Option>
                      <Select.Option value="硕士">硕士</Select.Option>
                      <Select.Option value="博士">博士</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="部署流程"
                >
                  {getFieldDecorator('procKey', {
                    rules: [{
                      required: true, message: '请选择招聘流程!',
                    }],
                  })(
                    this.props.isEdit ? 
                    <Select disabled>
                    {
                      this.state.procKeyList.map(p => <Select.Option key={ p.id } value={ p.key }>{ p.name }</Select.Option>)
                    }
                    </Select>
                    :
                    <Select>
                    {
                      this.state.procKeyList.map(p => <Select.Option key={ p.id } value={ p.key }>{ p.name }</Select.Option>)
                    }
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="岗位说明"
                >
                  {getFieldDecorator('memo', {})(
                    <Input.TextArea autosize={{ minRows: 6 }}/>
                  )}
                </Form.Item>
                <Form.Item {...tailformItemLayout}>
                  <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
              </Form>
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedCreateDemandPage = withRouter(Form.create()(CreateDemandPage));

export default WrappedCreateDemandPage;
