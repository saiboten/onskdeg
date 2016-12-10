// @flow
import React from 'react';

require('./container.css');

var Container = React.createClass( {
  render() {

    return (
      <div className="your-or-others-wish-selecting__container">
        {this.props.children}
      </div>
    );
  }
})

module.exports = Container;
