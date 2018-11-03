import React from 'react';
import { any } from 'prop-types';

const debug = require('debug')('Gift');

class Gift extends React.PureComponent {
  constructor(props) {
    super();
    debug('info: ', props.info);
  }

  render() {
    const { info: { name } } = this.props;

    return (
      <li className="smallspace">
        {name}
      </li>);
  }
}

Gift.propTypes = {
  info: any,
};

export default Gift;
