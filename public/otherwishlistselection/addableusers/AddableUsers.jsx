// @flow

import React from 'react';
import firebase from '../../firebase/firebase';
import user from '../../common/User';

const debug = require('debug')('AddableUser');

require('./addableusers.css');

class AddableUsers extends React.Component {

  static userInList(uid /* : String */, userlist /* : Array<Object> */) {
    debug('userInList: ', uid, userlist);
    if (!userlist) {
      return undefined;
    }

    return userlist.filter(userInList => (
        userInList.uid === uid
    )).length === 1;
  }

  constructor() {
    super();
    debug('constructor');
    this.state = { userlist: [], open: false };

    this.clearList = this.clearList.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');

    firebase.database().ref('userlist').on('value', (data) => {
      debug('Data returned: ', data.val());
      const userlist = data.val();

      firebase.database().ref(`users/${user.getUserUid()}`).on('value', (snapshot) => {
        const addedUsers = snapshot.val()
            ? snapshot.val().users
            : undefined;
        const filteredUserList = userlist.filter((dbuser) => {
          if (dbuser.uid === user.getUserUid()) {
            return false;
          } else if (this.userInList(dbuser.uid, addedUsers)) {
            return false;
          }
          return true;
        });

        this.setState({ userlist: filteredUserList });
      });
    });
  }

  addUser(e /* : Event */, userUid /* : String */) {
    debug('addUser', e, userUid);
    e.preventDefault();
    this.props.addUser(userUid);
  }

  clearList() {
    debug('clearList');

    this.setState({ userlist: [] });
  }

  toggleOpen() {
    debug('toggleOpen');

    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const addableUsers = this.state.userlist.map(userInList => (
    (<button
      className="addable-users__list-element border space button"
      onClick={(e) => {
        this.addUser(e, userInList.uid);
      }}
    >{ userInList.name }
    </button>
    )
      ));

    const content = this.state.open
          ? (
            <div className="addable-users__list">
              {addableUsers}
            </div>
          )
          : '';

    return (
      <div>
        <button className="button addable-users__expand-button smallspace" onClick={this.toggleOpen}>{this.state.open
                ? '-'
                : '+'}</button>
        {content}
      </div>
    );
  }
}

AddableUsers.propTypes = {
  addUser: React.PropTypes.func,
};

module.exports = AddableUsers;
