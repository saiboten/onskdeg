import React from 'react';
import { any, func } from 'prop-types';
import { Link } from 'react-router-dom';

require('./addeduserlink.css');

interface NewUser {
  name: string;
  email: string;
  uid: string;
}

const AddedUserLink = ({ el, deleteMe }: { el: NewUser, deleteMe: (email: string) => void }) => (
  <div className="added-user-link__wrapper flex-row space-between">
    <Link className="added-user-link__link button smallspace" to={`/other/${el.uid}`}>
      {el.name}
    </Link>
    <button
      type="button"
      className="added-user-link__delete smallspace button"
      onClick={() => deleteMe(el.email)}
    >{'Slett'}</button>
  </div>);

export default AddedUserLink;
