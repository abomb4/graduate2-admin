import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Avatar } from 'antd';
import './HomePage.css';
import { authorizationFunctions } from '../../../helpers';
import { ItrsDemandApi, ItrsFlowApi, ItrsScoreApi } from '../../../api/ItrsApi';

class HomePage extends React.Component {

  state = {
    recommends: [],
    scoreList: [],
    demandList: [],
    interview: []
  }

  componentWillMount() {
    if (authorizationFunctions.haveRole(this.props.loginUser, 'HR')) {
      ItrsDemandApi.getMyDemand({ pageNo: 1, pageSize: 2 },
        (success) => {
          if (success.success) {
            this.setState({ demandList: success.datas });
          } else {
          }
        },
        (fail) => {}
      );
    }

    ItrsFlowApi.listRecommenders({ pageNo: 1, pageSize: 2 },
      (success) => {
        if (success.success) {
          this.setState({ recommends: success.datas });
        } else {
        }
      },
      (fail) => {
      }
    );

    ItrsScoreApi.getScoreList({ pageNo: 1, pageSize: 2 },
      (success) => {
        if (success.success) {
          this.setState({ scoreList: success.datas });
        } else {
        }
      },
      (fail) => {
      }
    );

    ItrsFlowApi.needInterview({ pageNo: 1, pageSize: 2 },
      (success) => {
        if (success.success) {
          this.setState({ interview: success.datas });
        } else {
        }
      },
      (fail) => {
      }
    );
  }

  render() {

    return (
      <div className="profile-home-page">
        <div className="hello">
          <Avatar
            size="large"
            src="/assets/avatar.png"
          />
          <p className="hi">欢迎您，{ this.props.loginUser.realName }！</p>
          <p className="info">{ this.props.loginUser.departmentName }</p>
        </div>
        { authorizationFunctions.haveRole(this.props.loginUser, 'HR') ?
          <Card title="我的招聘" extra={<Link to="/myProfile/mydemand">更多</Link>}>
            { this.state.demandList.length > 0 ?
              this.state.demandList.map(demand => { 
                return <p key={ demand.id }>{ demand.gmtModify + ' ' + demand.jobName }</p> ;
              })
              : <p>暂无</p>
            }
          </Card>
          : null
        }
        <Card title="我的推荐" extra={<Link to="/myProfile/recommend">更多</Link>}>
          { this.state.recommends.length > 0 ?
            this.state.recommends.map(recommend => {
              return <p key={ recommend.id }>{ recommend.candidateName + ' - ' + recommend.jobName }</p> ;
            }) 
            : <p>暂无</p>
          }
        </Card>
        <Card title="我的积分" extra={<Link to="/myProfile/score">更多</Link>}>
          { this.state.scoreList.length > 0 ?
            this.state.scoreList.map(score => {
              return <p key={ score.id }>{ 
                score.gmtModify.substring(score.gmtModify, score.gmtModify.indexOf(' '))
                + ' - 推荐积分+' + score.score
              }</p> ;
            }) 
            : <p>暂无</p>
          }
        </Card>
        <Card title="我的面试" extra={<Link to="/myProfile/interviewee">更多</Link>}>
          { this.state.interview.length > 0 ?
            this.state.interview.map(interview => {
              return <p key={ interview.id }>{ 
                interview.gmtModify.substring(interview.gmtModify, interview.gmtModify.indexOf(' '))
                + ' - 推荐积分+' + interview.score
              }</p> ;
            }) 
            : <p>暂无</p>
          }
        </Card>
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
export default connect(mapStateToProps)(HomePage);
