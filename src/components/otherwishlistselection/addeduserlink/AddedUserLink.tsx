// @flow

import React from 'react';
import { any, func } from 'prop-types';
import { Link } from 'react-router-dom';

require('./addeduserlink.css');

class AddedUserLink extends React.PureComponent {
  render() {
    const { el, deleteMe } = this.props;

    return (
      <div className="added-user-link__wrapper flex-row space-between">
        <Link className="added-user-link__link button smallspace" to={`/other/${el.uid}`}>
          {el.name}
        </Link>
        <button
          type="button"
          className="added-user-link__delete smallspace button"
          onClick={() => deleteMe(el.email)}
        >
Slett

        </button>
      </div>);
  }
}

AddedUserLink.propTypes = {
  el: any,
  deleteMe: func,
};

export default AddedUserLink;
