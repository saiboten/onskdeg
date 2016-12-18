import React from 'react';

import Gift from './Gift';
import me from '../common/User';

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
    let gifts;
    if (this.props.wishes) {
      gifts = this.props.wishes.filter(el => (
        // debug('email, checkedby:', this.props.user.email, el.checkedby);
        me.getUserEmail() === el.checkedby && el.checked
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
  user: React.PropTypes.object,
  wishes: React.PropTypes.array,
};

module.exports = GiftedUser;
