import React from 'react';
import { Modal, Checkbox } from 'antd';

class AssignRoleModal extends React.Component {


  state = {
    checkedValue: this.props.exisRoleList
  }

  onChange = function(checkedValues) {
    console.log('checked = ', checkedValues);
    this.setState({
      checkedValue: checkedValues
    });
  }.bind(this);

  turnGroupRoleList(roleList) {
    const groupRoleList = [];
    for (var i in roleList) {
      const role = roleList[i];
      const roleCheckbox = { label: role.memo, value: role.roleName};
      groupRoleList.push(roleCheckbox);
    }
    return groupRoleList;
  }

  turnGroupExisRoleList(exisRoleList) {
    const groupExisRoleList = [];
    for (var i in exisRoleList) {
      const exisRole = exisRoleList[i];
      groupExisRoleList.push(exisRole.roleName);
    }
    return groupExisRoleList;
  }

  render() {
    return(
      <Modal
        title="分配角色"
        maskClosable={ true }
        visible={ this.props.visible }
        onOk={ this.props.handleOk }
        onCancel={ this.props.handleCancel }
        okText="分配"
        cancelText="取消"
        width="260px"
      >
      <Checkbox.Group options={ this.turnGroupRoleList(this.props.roleList) } value={ this.turnGroupExisRoleList(this.props.exisRoleList) } onChange={ this.onChange } />
    </Modal>
    );
  }
}

export default AssignRoleModal;

