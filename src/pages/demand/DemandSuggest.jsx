import React from 'react';
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

  // 根据最新职位的id进行查询
  handleNewDemandClick(newDemandQuery) {
    const { pageSize } = this.props.pagination;
    const pageNo = 1;
    const values = Object.assign({ pageNo, pageSize}, {id: newDemandQuery});
    this.props.doDemandQuery(values);
  }  

  render() {
    const newDemandList = [];
    const newDemandData = this.state.data;
    for (let i in newDemandData) {
      const newDemand = newDemandData[i];
      const newDemandTitle = newDemand.jobName + " - " + newDemand.departmentName;
      newDemandList.push(                
      <li className="new-demand-description" key={ newDemand.id }>
        <a onClick={ ()=>this.handleNewDemandClick(newDemand.id) } title={ newDemandTitle }>{ newDemandTitle }</a>
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