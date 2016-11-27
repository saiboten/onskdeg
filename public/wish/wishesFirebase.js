import store from '../store';
import {setAllWishes} from './wishactions';
var firebase = require('../firebase/firebase');
var debug = require('debug')('userlistListener');

var obj = {
  setupWishesListener() {
    firebase.database().ref('wishes').on('value', wishes => {
      store.dispatch(setAllWishes(wishes.val()));
    });
  }
};

module.exports = obj;
