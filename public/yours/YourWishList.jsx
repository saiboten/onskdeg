// @flow

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Container from '../common/container/Container';
import user from '../common/User';
import Wish from '../wish/Wish';
import firebase from '../firebase/firebase';
import store from '../store';


const debug = require('debug')('YourWishList');

require('./yourwishlist.css');

const mapStateToProps = function (state, ownProps) {
  debug('User wishes', state.wishReducer[user.getUserUid()]);
  return {
    wishes: state.wishReducer[user.getUserUid()] ? state.wishReducer[user.getUserUid()].wishes : [],
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    // addWish: dispatch.
  };
};

class YourWishList extends React.Component {

  getInitialState() {
    return {
      newWish: '',
      feedback: '',
    };
  }

  componentDidMount() {
    debug('componentDidMount');
  }

  /*eslint-disable */
  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
  }
  /*eslint-enable */


  updateWishState(e) {
    this.setState({
      newWish: e.target.value,
    });
  }

  addWish(e) {
    e.preventDefault();

    if (this.state.newWish === '') {
      this.setState({
        feedback: 'Ønsket kan ikke være tomt',
      });
      return;
    }

    debug('Adding wish');
    const newWishList = Object.assign([], this.props.wishes);
    newWishList.push({
      name: this.state.newWish,
      checked: false,
      id: this.createGuid(),
    });

    firebase.database().ref(`wishes/${user.getUserUid()}`).set({ wishes: newWishList });

    this.setState({
      newWish: '',
      feedback: '',
    });
  }

  update(wish) {
    debug('Saving wishlist: ', wish);
    const newWishList = this.props.wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.newWish,
          checked: e.checked,
          id: e.id,
        };
      }
      return e;
    });
    firebase.database().ref(`wishes/${user.getUserUid()}`).set({ wishes: newWishList });
  }

  delete(deleteId) {
    debug('Delete id: ', deleteId);
    const newWishList = Object.assign([], this.props.wishes);

    const filteredNewWishList = newWishList.filter((e) => {
      debug(e.id);
      return e.id !== deleteId;
    });

    debug('Wish list after deletion: ', newWishList);

    firebase.database().ref(`wishes/${user.getUserUid()}`).set({ wishes: filteredNewWishList });
  }

  render() {
    debug('This.props. ', this.props);
    const wishes = this.props.wishes.map((el) => {
      debug('Creating wish based on this el: ', el);
      return (<Wish update={this.update} delete={this.delete} wishlist={this.props.wishes} wish={el} />);
    });

    debug('Wishes: ', wishes);

    return (<Container>

      <div className="flex-row space-between">
        <h1>Din ønskeliste</h1>
        <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
      </div>
      <hr />

      <div className="your-wishlist__wishlist">
        {wishes}
      </div>

      <hr />

      <form onSubmit={this.addWish} >
        <div className="your-wishlist_add-wish-wrapper">
          <textarea
            placeholder="Legg inn nye ønsker her"
            className="your-wishlist_add-wish-textarea"
            value={this.state.newWish}
            onChange={this.updateWishState}
          />
          <input type="submit" className="your-wishlist_add-wish-submit button" value="Legg til" />
          <div>{this.state.feedback}</div>
        </div>
      </form>

    </Container>);
  }
}

YourWishList.propTypes = {
  wishes: React.PropTypes.array,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps)(YourWishList);
