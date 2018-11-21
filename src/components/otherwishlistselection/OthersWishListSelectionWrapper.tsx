import { connect } from 'react-redux';
import React from 'react';
import { any, array } from 'prop-types';
import styled from 'styled-components';

import AddedUserLink from './addeduserlink/AddedUserLink';
import store from '../../store';
import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import { loadFriends, setFriends } from '../../state/actions/friends';
import spinnerWhileLoading from '../common/spinnerWhileLoading';
import { User, FirebaseSnapshot } from '../../types/types';
import { deleteFriend as deleteFriendAction, addFriend as addFriendAction } from '../../state/actions/friends';

const debug = require('debug')('OthersWishListSelection');

require('./otherswishlistselection.css');

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  border-bottom: 1px solid black;
`;

interface P {
  user: User;
  friends: Array<User>;
  addFriend: (newFriendMail: string) => void;
  deleteFriend: (email: string) => void;
  updateFriendStore: (newFriendList: Array<User>) => void;
  newFriend: User;
  userNotFound: boolean;
}

interface S {
  newUser: string;
  feedback: string;
}

class OthersWishListSelection extends React.Component<P,S> {

  firebaseRef: any;

  constructor(props: any) {
    super(props);
    const { friends } = props;
    const initialUsers = friends || [];

    this.state = {
      newUser: '',
      feedback: '',
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.addUserClickEvent = this.addUserClickEvent.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    const { user, updateFriendStore } = this.props;
    const { uid } = user;

    this.firebaseRef = firebase.database().ref(`users/${uid}/friends`);
    this.firebaseRef.on('value', (snapshot: FirebaseSnapshot) => {
      updateFriendStore(snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  updateUserState(e: React.ChangeEvent<HTMLInputElement>) {
    debug('updateUserState');

    this.setState({ newUser: e.target.value });
  }

  addUserClickEvent(e: React.FormEvent<HTMLFormElement>) {
    debug('addUserClickEvent', e);
    const { newUser } = this.state;

    e.preventDefault();
    this.addUser(newUser);
    this.setState({
      newUser: ''
    })
  }

  addUser(newUserMail: string) {
    const { addFriend } = this.props;
    addFriend(newUserMail);
  }

  deleteUser(email: string) {
    const { deleteFriend } = this.props;
    deleteFriend(email);
  }

  render() {
    const { newUser, feedback } = this.state;
    const { friends, userNotFound } = this.props;

    const usersLinks = friends != null ? friends.map(el => (<AddedUserLink key={el.uid} deleteMe={this.deleteUser} el={el} />)) : null;

    return (
      <Container>
        <div className="wishlist-selection__added-users-container">
          {usersLinks}
        </div>

        <form onSubmit={this.addUserClickEvent}>
          <p>Legg til (legg inn epost)</p>
          <input value={newUser} onChange={this.updateUserState} />
          <input className="button button--padded" type="submit" value="OK" />
        </form>

        {userNotFound && <p>Fant ikke bruker</p>}
        <p>{feedback}</p>
      </Container>
    );
  }
}

const WithSpinner = spinnerWhileLoading(({ loaded, loading, load }: { loaded: boolean, loading: boolean, load: () => void}) => {
  if (!loaded && !loading) {
    load();
  }
  return !loaded;
})(OthersWishListSelection);

export default connect(
  ({ user, friends: { friends, loaded, loading, newFriend, userNotFound } }: { user: User, friends: { friends: Array<User>, loaded: boolean, loading: boolean, newFriend: User, userNotFound: boolean } }) => (
    {
      newFriend,
      userNotFound,
      user,
      friends,
      loaded,
      loading
    }
  ),
  dispatch => ({
    load: () => dispatch(loadFriends()),
    deleteFriend: (email: string) => {
      dispatch(deleteFriendAction(email));
    },
    updateFriendStore(newFriendList: Array<User>) {
      dispatch(setFriends(newFriendList));
    },
    addFriend(newFriendMail: string) {
      dispatch(addFriendAction(newFriendMail));
    }
  }),
)(WithSpinner);
