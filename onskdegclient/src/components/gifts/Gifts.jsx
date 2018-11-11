import React from 'react';
import { Link } from 'react-router-dom';
import { any, array } from 'prop-types';

import Container from '../common/container/Container';
import store from '../../store';
import firebase from '../firebase/firebase';
import GiftedUser from './GiftedUser';

const debug = require('debug')('Gifts');

class Gifts extends React.Component {
  static mapSuggestionToWish(uid) {
    const suggestions = store.getState().suggestion[uid];
    if (suggestions) {
      return suggestions.map(suggestion => (
        {
          checked: suggestion.checked,
          checkedby: suggestion.checkedBy,
          name: suggestion.wishSuggestion,
        }
      ));
    }
    return [];
  }

  constructor() {
    super();
    this.state = {
      giftedUsers: [],
    };
    this.storeSubscription = undefined;
    this.updateWishes = this.updateWishes.bind(this);
    this.updateWishBasedOnUserList = this.updateWishBasedOnUserList.bind(this);
  }

  componentDidMount() {
    this.storeSubscription = store.subscribe(this.updateWishes);
    this.updateWishes();
  }

  componentWillUnmount() {
    debug('Unsubscribing');
    this.storeSubscription();
  }

  updateWishes() {
    debug('All users: ', store.getState().allUserReducer);
    const { user } = this.props;

    const ref = firebase.database().ref(`users/${user.uid}`);
    ref.once('value', (snapshot) => {
      if (snapshot.val() != null) {
        const list = snapshot.val().users;
        debug('data :', list);
        this.updateWishBasedOnUserList(list);
      }
    });
  }

  updateWishBasedOnUserList(userlist) {
    const giftedUsers = userlist.map((giftedUser) => {
      debug('Gifted user: ', giftedUser);

      const suggestions = Gifts.mapSuggestionToWish(giftedUser.uid);


      let wishes;
      if (store.getState().wishReducer[giftedUser.uid]) {
        wishes = store.getState().wishReducer[giftedUser.uid].wishes;
      }

      if (!wishes) {
        wishes = [];
      }

      debug('suggestions: ', suggestions, '. Wishes: ', wishes);

      return (<GiftedUser user={giftedUser} wishes={wishes.concat(suggestions)} />);
    });

    /* const wishes = Object.keys(store.getState().wishReducer).reduce((prev, curr) => {
      const value = store.getState().wishReducer[curr];
      return prev.concat(
        value.wishes
        .filter(el => (el.checked && el.checkedby === me.getUserEmail()))
        .map(el => ({ wish: el, user: curr })));
    }, []).map(el => (<li className="smallspace">Gave til: {this.userFromUid(el.user)} - {el.wish.name}</li>)); */

    this.setState({
      giftedUsers,
    });
  }

  userFromUid(uid) {
    const { users } = this.props;
    debug('All users: ', users);
    return users.reduce((prev, curr) => (
      uid === curr.uid ? curr.name : prev
    ), '');
  }

  render() {
    debug('Wishes: ', store.getState().wishReducer);
    const { giftedUsers } = this.state;

    return (
      <Container>
        <div className="flex-row space-between">
          <h1>Dine gaver</h1>
          <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
        </div>
        <hr />

        <ul>{giftedUsers}</ul>

      </Container>);
  }
}

Gifts.propTypes = {
  user: any,
  users: array,
};

Gifts.defaultProps = {
  user: {},
  users: [],
};


export default Gifts;
