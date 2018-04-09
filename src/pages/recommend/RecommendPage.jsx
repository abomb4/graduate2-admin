import React from 'react';

const { Component } = React;

class TestPage extends Component {

  render() {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const { a, b } = obj;

    console.log(a);
    return (
      <div className="testpage">
        { b }
      </div>
    );
  }
}

export default TestPage;
