import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class CheckLoginStatus extends React.PureComponent {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    userActions.checkTimeout()(dispatch);
  }
  
  render() {
    return null;
  }
}

export default connect((state) => { return {}; })(CheckLoginStatus);
