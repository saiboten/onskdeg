import { connect } from 'react-redux';
import React from 'react';
import { any, array } from 'prop-types';
import styled from 'styled-components';

import AddedUserLink from './addeduserlink/AddedUserLink';
import store from '../../store';
import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import { loadFriends } from '../../state/actions/friends';
import spinnerWhileLoading from '../common/spinnerWhileLoading';
import { User } from '../../types/types';

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
}

interface S {
  users: Array<User>;
  newUser: string;
  feedback: string;
}

class OthersWishListSelection extends React.Component<P,S> {
  constructor(props: any) {
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

  updateUserState(e: React.ChangeEvent<HTMLInputElement>) {
    debug('updateUserState');

    this.setState({ newUser: e.target.value });
  }

  addUserClickEvent(e: React.FormEvent<HTMLFormElement>) {
    debug('addUserClickEvent', e);
    const { newUser } = this.state;

    e.preventDefault();
    this.addUser(newUser);
  }

  addUser(newUserMail: string) {
    // FIXME rewrite
  }

  deleteUser(email: string) {
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
        <StyledHeader>
          <h1>Se ønskeliste til</h1>
        </StyledHeader>
        <div className="wishlist-selection__added-users-container">
          {usersLinks}
        </div>

        <form onSubmit={this.addUserClickEvent}>
          <p>Legg til (legg inn epost)</p>
          <input value={newUser} onChange={this.updateUserState} />
          <input className="button button--padded" type="submit" value="OK" />
        </form>

        <p>{feedback}</p>
      </Container>
    );
  }
}

const WithSpinner = spinnerWhileLoading(({ loaded, loading, load }}) => {
  if (!loaded && !loading) {
    load();
  }
  return !loaded;
})(OthersWishListSelection);

export default connect(
  ({ user, friends: { friends, loaded, loading } }: { user: User, friends: { friends: Array<User>, loaded: boolean, loading: boolean } }) => (
    {
      user,
      friends,
      loaded,
      loading
    }
  ),
  dispatch => ({
    load: () => dispatch(loadFriends()),
  }),
)(WithSpinner);
