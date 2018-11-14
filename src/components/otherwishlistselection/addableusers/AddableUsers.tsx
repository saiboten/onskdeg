import React from 'react';
import { func, any } from 'prop-types';
import firebase from '../../firebase/firebase';
import { User } from '../../../types/types';

const debug = require('debug')('AddableUser');

require('./addableusers.css');

interface P {
  user: User;
  addUser: (uid: string) => void;
}

interface S {
  open: boolean;
  userlist: Array<User>;
}

class AddableUsers extends React.Component<P,S> {
  static userInList(uid: string, userlist: Array<User>) {
    debug('userInList: ', uid, userlist);
    if (!userlist) {
      return undefined;
    }

    return userlist.filter(userInList => (
      userInList.uid === uid
    )).length === 1;
  }

  constructor(props: any) {
    super(props);
    debug('constructor');
    this.state = { userlist: [], open: false };

    this.clearList = this.clearList.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    const { user } = this.props;

    firebase.database().ref('userlist').on('value', (data) => {
      if(!data) {
        return;
      }
      debug('Data returned: ', data.val());
      const userlist = data.val();

      firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
        if(!snapshot) {
          return null;
        }

        const addedUsers = snapshot.val()
          ? snapshot.val().users
          : undefined;
        const filteredUserList = userlist.filter((dbuser: User) => {
          if (dbuser.uid === user.uid) {
            return false;
          } if (AddableUsers.userInList(dbuser.uid, addedUsers)) {
            return false;
          }
          return true;
        });

        this.setState({ userlist: filteredUserList });
      });
    });
  }

  addUser(e: React.MouseEvent<HTMLElement>, userUid: string) {
    debug('addUser', e, userUid);
    const { addUser } = this.props;
    e.preventDefault();
    addUser(userUid);
  }

  clearList() {
    debug('clearList');

    this.setState({ userlist: [] });
  }

  toggleOpen() {
    debug('toggleOpen');
    const { open } = this.state;

    this.setState({
      open: !open,
    });
  }

  render() {
    const { userlist, open } = this.state;

    const addableUsers = userlist.map(userInList => (
      (
        <button
          type="button"
          className="addable-users__list-element border space button"
          onClick={(e) => {
            this.addUser(e, userInList.uid);
          }}
        >
          { userInList.name }
        </button>
      )
    ));

    const content = open
      ? (
        <div className="addable-users__list">
          {addableUsers}
        </div>
      )
      : '';

    return (
      <div>
        <button type="button" className="button addable-users__expand-button smallspace" onClick={this.toggleOpen}>
          {open
            ? '-'
            : '+'}

        </button>
        {content}
      </div>
    );
  }
}

export default AddableUsers;
