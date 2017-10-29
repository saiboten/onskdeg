// @flow

import React from 'react';
import { any, func } from 'prop-types';
import { Link } from 'react-router';

const debug = require('debug')('AddedUserLink');

require('./addeduserlink.css');

class AddedUserLink extends React.PureComponent {

  render() {
    return (
      <div className="added-user-link__wrapper flex-row space-between">
        <Link className="added-user-link__link button smallspace" to={`/other/${this.props.el.uid}`}>
          {this.props.el.name}
        </Link>
        <button
          className="added-user-link__delete smallspace button"
          onClick={e => this.props.deleteMe(this.props.el.email)}
        >Slett</button>
      </div>);
  }
}

AddedUserLink.propTypes = {
  el: any,
  deleteMe: func
};

export default AddedUserLink;
