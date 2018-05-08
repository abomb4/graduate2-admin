import React from 'react';
import { Link } from 'react-router-dom';
import { ItrsDemandApi } from '../../api/ItrsApi';

class DemandSuggest extends React.Component {
  state = {
    data : []
  }

  componentDidMount() {
    ItrsDemandApi.getNew(
      (successResult) => {
        if (successResult.success) {
          const data = successResult.datas;
          this.setState({ data: data });
        } else {
          console.error(successResult);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  render() {
    const newDemandList = [];
    const newDemandData = this.state.data;
    for (let i in newDemandData) {
      const newDemand = newDemandData[i];
      const newDemandTitle = newDemand.jobName + " - " + newDemand.departmentName;
      newDemandList.push(                
      <li className="new-demand-description" key={ newDemand.id }>
        <Link to="#" title={ newDemandTitle }>{ newDemandTitle }</Link>
      </li>)
    }
    return (
      <ul className="new-demand-list">
        { newDemandList }
      </ul>
    );
  }

}

export default DemandSuggest;