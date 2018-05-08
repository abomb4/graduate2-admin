import React from 'react';
import { withRouter } from 'react-router-dom';
import './RecommendPage.css';

const { Component } = React;

class RecommendPage extends Component {
  render() {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const { a, b } = obj;

    return(a);
  }
}

export default RecommendPage;