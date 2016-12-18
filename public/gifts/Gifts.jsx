import React from 'react';
import { Link } from 'react-router';

import Container from '../common/container/Container';
import store from '../store';
import me from '../common/User';
import userlistFirebase from '../users/userlistFirebase';

const debug = require('debug')('Gifts');

class Gifts extends React.Component {

  constructor() {
    super();
    this.state = {
      wishes: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    userlistFirebase.subscribe();
    store.subscribe(this.handleChange);
  }

  componentDidUnmount() {
    userlistFirebase.unsubscribe();
  }

  handleChange() {
    const wishes = Object.keys(store.getState().wishReducer).reduce((prev, curr) => {
      const value = store.getState().wishReducer[curr];
      return prev.concat(
        value.wishes
        .filter(el => (el.checked && el.checkedby === me.getUserEmail()))
        .map(el => ({ wish: el, user: curr })));
    }, []).map(el => (<li className="smallspace">Gave til: {this.userFromUid(el.user)} - {el.wish.name}</li>));

    this.setState({
      wishes,
    });
  }

  userFromUid(uid) {
    debug('All users: ', store.getState().allUserReducer);
    return store.getState().allUserReducer.reduce((prev, curr) => (
      uid === curr.uid ? curr.name : prev
    ), '');
  }

  render() {
    debug('Wishes: ', store.getState().wishReducer);

    return (
      <Container>
        <div className="flex-row space-between">
          <h1>Dine gaver</h1>
          <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
        </div>
        <hr />

        <ul>{this.state.wishes}</ul>

      </Container>);
  }

}

module.exports = Gifts;
