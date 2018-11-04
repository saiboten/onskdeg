import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { any, array } from 'prop-types';
import AddedUserLink from './addeduserlink/AddedUserLink';
import store from '../../store';
import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import { loadFriends } from '../../state/actions/friends';
import spinnerWhileLoading from '../common/spinnerWhileLoading';

const debug = require('debug')('OthersWishListSelection');

require('./otherswishlistselection.css');

class OthersWishListSelection extends React.Component {
  constructor(props) {
    super(props);
    const { friends } = props;
    const initialUsers = friends || [];

    this.state = {
      users: initialUsers,
      newUser: '',
      feedback: '',
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.addUserClickEvent = this.addUserClickEvent.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  updateUserState(e) {
    debug('updateUserState');

    this.setState({ newUser: e.target.value });
  }

  addUserLinkClick(uid) {
    debug('addUserLinkClick', uid);

    const userfromdb = store.getState().users.filter(userdb => userdb.uid === uid)[0];
    this.addUser(userfromdb.email);
  }

  addUserClickEvent(e) {
    debug('addUserClickEvent', e);
    const { newUser } = this.state;

    e.preventDefault();
    this.addUser(newUser);
  }

  addUser(newUserMail) {
    debug('addUserClickEvent', newUserMail);

    const { users, user } = this.props;
    const { users: stateUsers } = this.state;

    const userfromdb = users.filter((userdb) => {
      if (userdb.email === newUserMail) {
        return true;
      }
      return false;
    })[0];

    debug('User from db : ', userfromdb);

    if (userfromdb) {
      if (stateUsers.filter(stateUser => stateUser.email === newUserMail).length === 1) {
        this.setState({ feedback: 'Brukeren er lagt til fra før' });
      } else if (newUserMail === user.email) {
        this.setState({ feedback: 'Du har ikke lov å legge til deg selv' });
      } else {
        const newList = stateUsers.concat([userfromdb]);

        debug('New list: ', newList);
        firebase.database().ref(`users/${user.uid}`).set({ users: newList });
        this.setState({ newUser: '' });
      }
    } else {
      this.setState({ feedback: 'Denne brukeren finnes ikke' });
    }
  }

  deleteUser(email) {
    debug('deleteUser', email);
    const { user } = this.props;
    const { users } = this.state;

    const userList = users.slice();
    const newUserList = userList.filter(stateUser => stateUser.email !== email);

    firebase.database().ref(`users/${user.uid}`).set({ users: newUserList });
    if (newUserList.length === 0) {
      this.setState({
        users: [],
      });
    }
  }

  render() {
    const { users, newUser, feedback } = this.state;
    const usersLinks = users.map(el => (<AddedUserLink key={el.uid} deleteMe={this.deleteUser} el={el} />));

    return (
      <Container>
        <div className="flex-row space-between">
          <h1>Andres ønskeliste</h1>
          <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
        </div>
        <hr />

        <h2>Se ønskeliste til</h2>
        <div className="wishlist-selection__added-users-container">
          {usersLinks}
        </div>

        <form onSubmit={this.addUserClickEvent}>
          <p>Legg til (legg inn epost)</p>
          <input value={newUser} onChange={this.updateUserState} />
          <input type="submit" value="" />
        </form>

        <p>{feedback}</p>
      </Container>
    );
  }
}

OthersWishListSelection.propTypes = {
  user: any,
  users: array,
  friends: array,
};

OthersWishListSelection.defaultProps = {
  user: {},
  users: [],
  friends: null,
};

const WithSpinner = spinnerWhileLoading(({ loaded, loading, load }) => {
  if (!loaded && !loading) {
    load();
  }
  return !loaded;
})(OthersWishListSelection);

export default connect(
  ({ user, friends: { friends, loaded, loading }, users }) => (
    {
      user,
      friends,
      loaded,
      loading,
      users,
    }
  ),
  dispatch => ({
    load: () => dispatch(loadFriends()),
  }),
)(WithSpinner);
