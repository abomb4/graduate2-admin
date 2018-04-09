import React from 'react';
import ItrsApi from '../api/ItrsApi';

const { Component } = React;

class IndexPage extends Component {

  state = {
    data: {},
  }

  componentDidMount() {
    ItrsApi.getUser(1,
      (successResult) => {
        if (successResult.success) {
          this.setState({ data: successResult.data });
        } else {

        }
        console.log(successResult);
      },
      (failResult) => {
        console.log(failResult);
      }
    );
  }

  render() {
    const data = this.state.data;
    return (
      <div className="IndexPage">
        <div className="user">
          <p className="id">{ data.id }</p>
          <p className="userName">{ data.userName }</p>
          <p className="email">{ data.email }</p>
          <p className="gmtCreate">{ data.gmtCreate }</p>
          <p className="gmtModify">{ data.gmtModify }</p>
          <p className="realName">{ data.realName }</p>
          <p className="departmentId">{ data.departmentId }</p>
          <p className="sex">{ data.sex }</p>

        </div>
      </div>
    );
  }
}

export default IndexPage;
