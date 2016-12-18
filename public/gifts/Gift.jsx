import React from 'react';

const debug = require('debug')('Gift');

class Gift extends React.PureComponent {

  constructor(props) {
    super();
    debug('info: ', props.info);
  }

  render() {
    return (
      <li className="smallspace">
        {this.props.info.name}
      </li>);
  }
}

Gift.propTypes = {
  info: React.PropTypes.object,
};

module.exports = Gift;
