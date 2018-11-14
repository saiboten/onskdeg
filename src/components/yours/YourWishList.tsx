import React from 'react';
import { array, any, func } from 'prop-types';
import { connect } from 'react-redux';

import Container from '../common/container/Container';
import Wish from '../wish/Wish';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';

import { setWishes } from '../../state/actions/wish';
import { Wish as WishType, User, FirebaseSnapshot } from '../../types/types';

const debug = require('debug')('YourWishList');

require('./yourwishlist.scss');

interface P {
  user: User;
  update: (newWishes: Array<Wish>) => void;
  wishes: Array<WishType>
}

interface S {
  
}

class YourWishList extends React.Component<P,S> {

  firebaseRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      newWish: '',
      feedback: '',
    };

    this.addWish = this.addWish.bind(this);
    this.updateWishState = this.updateWishState.bind(this);
    this.update = this.update.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.addImage = this.addImage.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    const { user, update } = this.props;

    this.firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

    this.firebaseRef.on('value', (snapshot: FirebaseSnapshot) => {
      update(snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  /*eslint-disable */
  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
  }
  /* eslint-enable */


  updateWishState(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      newWish: e.target.value,
    });
  }

  addWish(e: React.FormEvent<HTMLFormElement>) {
    const { user, wishes, update } = this.props;
    const { newWish } = this.state;

    e.preventDefault();

    if (newWish === '') {
      this.setState({
        feedback: 'Ønsket kan ikke være tomt',
      });
      return;
    }

    debug('Adding wish');
    const newWishList = Object.assign([], wishes);
    newWishList.unshift({
      name: newWish,
      checked: false,
      id: this.createGuid(),
    });

    update(newWishList);

    this.setState({
      newWish: '',
      feedback: '',
    });
  }

  update(wish: WishType) {
    debug('Saving wishlist: ', wish);
    const { user, wishes, update } = this.props;

    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          checked: wish.checked,
          checkedby: wish.checkedby ? wish.checkedby : '',
          id: wish.id,
          image: wish.image ? wish.image : '',
        };
      }
      return e;
    });
    update(newWishList);
  }

  addImage(wish, image) {
    debug('Adding image to wish: ', wish, image);
    const { user, wishes } = this.props;
    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          checked: wish.checked,
          checkedby: wish.checkedby ? wish.checkedby : '',
          id: wish.id,
          image,
        };
      }
      return e;
    });
    firebase.database().ref(`wishes/${user.uid}`).set({ wishes: newWishList });
  }

  deleteThis(deleteId) {
    debug('Delete id: ', deleteId);
    const { user, wishes } = this.props;
    const newWishList = Object.assign([], wishes);

    const filteredNewWishList = newWishList.filter((e) => {
      debug(e.id);
      return e.id !== deleteId;
    });

    debug('Wish list after deletion: ', newWishList);

    firebase.database().ref(`wishes/${user.uid}`).set({ wishes: filteredNewWishList });
  }

  render() {
    debug('This.props. ', this.props);
    const { wishes } = this.props;
    const { newWish, feedback } = this.state;

    const wishesNew = wishes.map((el: WishType) => {
      debug('Creating wish based on this el: ', el);
      return (
        <Wish
          key={el.id}
          update={this.update}
          delete={this.deleteThis}
          addImage={this.addImage}
          wish={el}
        />);
    });

    debug('Wishes: ', wishesNew);

    return (
      <Container>

        <div className="flex-row space-between">
          <h1>Din ønskeliste</h1>
        </div>

        <form onSubmit={this.addWish}>
          <div className="your-wishlist_add-wish-wrapper">
            <textarea
              placeholder="Legg inn nye ønsker her"
              className="your-wishlist_add-wish-textarea"
              value={newWish}
              onChange={this.updateWishState}
            />
            <Icon type="submit" name="check" onClick={() => null} />
            <div>{feedback}</div>
          </div>
        </form>

        <div className="your-wishlist__wishlist">
          {wishesNew}
        </div>

      </Container>
    );
  }
}

export default connect(
  ({ wish, user }) => {
    debug('User wishes', wish[user.uid]);
    return {
      wishes: wish[user.uid] ? wish[user.uid] : [],
      user,
    };
  },
  dispatch => ({
    update: (newData) => {
      dispatch(setWishes(newData));
    },
  }),
)(YourWishList);
