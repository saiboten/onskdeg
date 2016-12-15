// @flow

import store from '../store';
import { setAllWishes } from './wishactions';
import firebase from '../firebase/firebase';

const debug = require('debug')('userlistListener');


const obj = {
  setupWishesListener() {
    firebase.database().ref('wishes').on('value', (wishes) => {
      store.dispatch(setAllWishes(wishes.val()));
    });
  },
};

module.exports = obj;
