import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, message } from 'antd';
import { ItrsDictionaryApi, ItrsDemandApi } from '../../api/ItrsApi';
import { loginActions } from '../../_actions';
import { DemandQueryForm, DemandRecommendForm, DemandList, DemandSuggest } from '.';
import './DemandPage.css';

const { Component } = React;

class DemandPage extends Component {

  state = {
    positionTypeMap: {},
    positionTypeRootList: [],
    positionTypeInited: false,
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    showRecommend: false,
    datas: []
  }
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.onRecommendDialogOpen = this.onRecommendDialogOpen.bind(this);
    this.onRecommendDialogClose = this.onRecommendDialogClose.bind(this);
  }

  componentDidMount() {

    this.initPositionTypes();
    this.handleInitSearch();
  }

  initPositionTypes() {
    if (this.state.positionTypeInited === true) {
      return;
    }

    const positionTypeMap = {};
    const positionTypeRootList = [];

    // 在页面加载时，初始化职位类别。
    // 职位类别没初始化之前，不能进行需求查询。
    ItrsDictionaryApi.getPositions(
      (success) => {
        if (success.success) {
          for (var i in success.data) {
            var position = success.data[i];
            positionTypeMap[position.id] = position;
            positionTypeRootList.push(position);

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
            positionTypeRootList: positionTypeRootList,
            positionTypeInited: true,
          });
        }
      },
      (fail) => {}
    );
  }

  doDemandQuery = function(values) {
    this.setState({ requesting: true });
    ItrsDemandApi.list(values,
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

  handleInitSearch = function() {
    const queryData = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo: 1, pageSize }, queryData);

    this.doDemandQuery(values);
  }.bind(this);

  handleSearch = function() {
    this.props.form.setFieldsValue({ id: null });
    const queryData = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo: 1, pageSize }, queryData);

    this.doDemandQuery(values);
  }.bind(this)

  handlePageChange(pageNo) {
    const queryData = this.props.form.getFieldsValue();
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize }, queryData);

    this.doDemandQuery(values);
  }

  onRecommendDialogOpen(demand) {
    const { dispatch } = this.props;

    if (!this.props.loginUser) {
      message.info('您需要先登陆才能进行推荐', 3);
      loginActions.show()(dispatch);
    } else {
      this.setState({
        showRecommend: true,
        currentDemand: demand
      });
    }
  }

  onRecommendDialogClose() {
    this.setState({ showRecommend: false });
  }


  render() {
    const data = this.state.datas;

    const pageSize = 1;

    // TODO 分页点击之后，触发表单提交事件
    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div id='demand-page'>
        {<DemandQueryForm
          form={ this.props.form }
          pageSize={ pageSize }
          doSearch={ this.handleSearch }
          positionTypeMap={ this.state.positionTypeMap }
          positionTypeRootList={ this.state.positionTypeRootList }
        />
        }
        <div className='page-content demand-page-main'>
          <div className="demand-list-container">
            <DemandList requesting={ this.state.requesting }
              dataSource={ data }
              pagination={ pagination }
              onChange={ this.handlePageChange }
              onRecommendDialogOpen={ this.onRecommendDialogOpen }
              onRecommendDialogClose={ this.onRecommendDialogClose }
            />
          </div>
          <div className="demand-suggest-container">
            <h2>最新职位</h2>
            <DemandSuggest doDemandQuery={ this.doDemandQuery } pagination={ this.state.pagination }/>
          </div>
        </div>
        <DemandRecommendForm
          title="人员推荐"
          currentDemand={ this.state.currentDemand }
          visible={ this.state.showRecommend }
          onOk={ this.handleOk }
          onCancel={ this.onRecommendDialogClose }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.userReducer;

  return {
    loginUser: user
  };
}
export default connect(mapStateToProps)(withRouter(Form.create({})(DemandPage)));
