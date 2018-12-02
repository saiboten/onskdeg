import React from 'react';
import { connect } from 'react-redux';

import Wish from '../wish/Wish';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';

import { setWishes, storeOwnWishesToFirebase } from '../../state/actions/wish';
import { Wish as WishType, User, FirebaseSnapshot } from '../../types/types';
import Container from '../common/container/Container';

const debug = require('debug')('YourWishList');

require('./yourwishlist.scss');

interface P {
  user: User;
  updateWishStore: (newWishes: Array<WishType>) => void;
  storeWishesToFirebase: (newWishes: Array<WishType>) => void;
  wishes: Array<WishType>;
}

interface S {
  newWish: string;
  feedback: string;
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
    const { user, updateWishStore } = this.props;

    this.firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

    this.firebaseRef.on('value', (snapshot: FirebaseSnapshot) => {
      updateWishStore(snapshot.val());
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


  updateWishState(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newWish: e.target.value,
    });
  }

  addWish(e: React.FormEvent<HTMLFormElement>) {
    const { user, wishes, storeWishesToFirebase } = this.props;
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
      id: this.createGuid(),
      image: '',
      accomplished: false,
      accompllishedby: '',
      deleted: false,
      description: '',
      link: ''
    });

    storeWishesToFirebase(newWishList);

    this.setState({
      newWish: '',
      feedback: '',
    });
  }

  update(wish: WishType) {
    debug('Saving wishlist: ', wish);
    const { user, wishes, storeWishesToFirebase } = this.props;

    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image: wish.image ? wish.image : '',
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  addImage(wish: WishType, image: string) {
    debug('Adding image to wish: ', wish, image);
    const { wishes, storeWishesToFirebase } = this.props;
    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image,
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  deleteThis(deleteId: string) {
    debug('Delete id: ', deleteId);
    const { user, wishes, storeWishesToFirebase } = this.props;
    const newWishList = Object.assign([], wishes);

    const filteredNewWishList = newWishList.filter((e: WishType) => {
      debug(e.id);
      return e.id !== deleteId;
    });

    debug('Wish list after deletion: ', newWishList);

    storeWishesToFirebase(filteredNewWishList);
  }

  render() {
    debug('This.props. ', this.props);
    const { wishes } = this.props;
    const { newWish, feedback } = this.state;

    const wishesEl = wishes.map((el: WishType) => {
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

    debug('Wishes: ', wishesEl);
    
    return (
      <Container>
        <form onSubmit={this.addWish}>  
          <div className="your-wishlist__add-wish-wrapper">
            <input
              type="text"
              placeholder="Legg inn nye ønsker her"
              className="your-wishlist__add-wish-textarea"
              value={newWish}
              onChange={this.updateWishState}
            />
            <Icon type="submit" name="check" onClick={() => null} className="your-wishlist__add-wish-submit" />
            <div>{feedback}</div>
          </div>
        </form>

        <div className="your-wishlist__wishlist">
          {wishesEl}
        </div>
      </Container>
    );
  }
}

export default connect(
  ({ wish: { wishes }, user }: { wish: any, user: User}) => {
    debug('User wishes', wishes[user.uid]);
    return {
      wishes: wishes[user.uid] ? wishes[user.uid] : [],
      user,
    };
  },
  dispatch => ({
    updateWishStore: (newData: Array<WishType>) => {
      dispatch(setWishes(newData));
    },
    storeWishesToFirebase: (newData: Array<WishType>) => {
      dispatch(storeOwnWishesToFirebase(newData));
    },
  }),
)(YourWishList);
