// @flow
import React from 'react';
import { string } from 'prop-types';

require('./container.css');

class Container extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <div className="your-or-others-wish-selecting__container">
        {children}
      </div>
    );
  }
}

Container.propTypes = {
  children: string.isRequired,
};

export default Container;
