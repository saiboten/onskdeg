import React from 'react';
import { any, array } from 'prop-types';

import Gift from './Gift';

const debug = require('debug')('GiftedUser');

class GiftedUser extends React.Component {
  constructor(props) {
    super();
    this.setState = {
      gifts: []
    };
    debug('wishes', props.wishes);
  }

  render() {
    const { user } = this.props;
    let gifts;
    if (this.props.wishes) {
      gifts = this.props.wishes.filter(el => (
        // debug('email, checkedby:', this.props.user.email, el.checkedby);
        user.getUserEmail() === el.checkedby && el.checked
      ))
      .map(el => (
        (<Gift info={el} />)
      ));
      if (gifts.length === 0) {
        gifts = (<div>Ingen gaver :(</div>);
      }
    } else {
      gifts = (<div>{this.props.user.name} har ingen ønsker!</div>);
    }

    return (
      <div>
        <h2>{this.props.user.name}</h2>
        <ul>{gifts}</ul>
      </div>);
  }
}

GiftedUser.propTypes = {
  user: any,
  wishes: array
};

export default GiftedUser;
