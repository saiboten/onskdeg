// @flow
let debug = require('debug')('userlistListener');

import store from '../store';
import {setAllWishes} from './wishactions';
import firebase from '../firebase/firebase';

let obj = {
  setupWishesListener() {
    firebase.database().ref('wishes').on('value', wishes => {
      store.dispatch(setAllWishes(wishes.val()));
    });
  }
};

module.exports = obj;
