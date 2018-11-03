import React from 'react';
import { any, array } from 'prop-types';

import Gift from './Gift';

const debug = require('debug')('GiftedUser');

class GiftedUser extends React.Component {
  constructor(props) {
    super();
    this.setState = {
      gifts: [],
    };
    debug('wishes', props.wishes);
  }

  render() {
    const { user, wishes } = this.props;
    let gifts;
    if (wishes) {
      gifts = wishes.filter(el => (
        // debug('email, checkedby:', this.props.user.email, el.checkedby);
        user.email === el.checkedby && el.checked
      ))
        .map(el => (
          (<Gift info={el} />)
        ));
      if (gifts.length === 0) {
        gifts = (<div>Ingen gaver :(</div>);
      }
    } else {
      gifts = (
        <div>
          {user.name}
          {' '}
har ingen ønsker!
        </div>
      );
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <ul>{gifts}</ul>
      </div>);
  }
}

GiftedUser.propTypes = {
  user: any,
  wishes: array,
};

export default GiftedUser;
