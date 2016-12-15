// @flow
import React from 'react';

require('./container.css');

class Container extends React.PureComponent {
  render() {
    return (
      <div className="your-or-others-wish-selecting__container">
        {this.props.children}
      </div>
    );
  }
}

Container.propTypes = {
  children: React.PropTypes.string.isRequired,
};

module.exports = Container;
