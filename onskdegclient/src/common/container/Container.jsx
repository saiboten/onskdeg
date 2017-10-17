// @flow
import React from 'react';
import { string } from 'prop-types';

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
  children: string.isRequired,
};

export default Container;
