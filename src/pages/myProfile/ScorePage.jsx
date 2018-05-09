import React from 'react';
import { Spin, Table, List, Row, Col } from 'antd';
import { ItrsScoreApi } from '../../api/ItrsApi';

class ScorePage extends React.Component {

  state = {
    pagination: {
      pageNo: 1,
      pageSize: 6,
      total: 0
    },
    requesting: false,
    listFlow: [],
    listRule: [],
  }

  componentDidMount() {
    let pageNo = 1;
    // 这里让规则全部显示出来
    let pageSize = 100;
    const ruleQuery = Object.assign({ pageNo, pageSize });

    this.handlePageChange(pageNo);
    this.doRuleListQuery(ruleQuery);
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
          listFlow: success.datas,
          requesting: false
        });
      },
      (fail) => {
        this.setState({ requesting: false });
      }
    );
  }.bind(this);

  // 查询积分规则
  doRuleListQuery = function(values) {
    ItrsScoreApi.getScoreRule(values,
      (success) => {
        const listRuleObject = success.datas;
        const listRuleStr = [];
        for (let i in listRuleObject) {
          const ruleObject = listRuleObject[i];
          const ruleStr = ruleObject.rule + " -> " + ruleObject.score + "分";
          listRuleStr.push(ruleStr);
        }
        this.setState({
          listRule: listRuleStr
        });
      }, 
      (fail) => {
        console.error(fail);
      }
    );
  }.bind(this);

  handlePageChange(pageNo) {
    const { pageSize } = this.state.pagination;
    const values = Object.assign({ pageNo, pageSize });

    this.doScoreListQuery(values);
  }

  render() {
    const listFlow = this.state.listFlow;
    const listRule = this.state.listRule;

    const pagination = {
      pageSize: this.state.pagination.pageSize,
      pageNo: this.state.pagination.pageNo,
      total: this.state.pagination.total,
      onChange: this.handlePageChange.bind(this)
    };

    return (
      <div>
        <Row>
          <Col span={ 18 }>
            <div className="score-list-container">
            <ScoreList requesting={ this.state.requesting }
              dataSource={ listFlow }
              pagination={ pagination }
              onChange={ this.handlePageChange }
            />
          </div>
          </Col>
          <Col span={ 6 }>
            <ScoreRule
              dataSource={ listRule }
            />
          </Col>
        </Row>
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

class ScoreRule extends React.Component {
  render() {
    return (
      <div className="score-rule-container">
        <List
          size="small"
          header={< div>积分规则</div> }
          bordered
          dataSource={ this.props.dataSource }
          renderItem={ item => (<List.Item>{ item }</List.Item>)}
        />
      </div>
    );
  }
}

class CurrentScore extends React.Component {

}

export default ScorePage;