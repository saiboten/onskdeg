import store from '../store';
import {setUserlist} from './userlistactions';
var firebase = require('../firebase/firebase');
var debug = require('debug')('userlistListener');

var fbdb = undefined;

var obj = {
  subscribe() {
    fbdb = firebase.database();
    fbdb.ref('userlist').on('value', userlistdb => {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  },
  unsubscribe() {
    if(fbdb) {
      fbdb.off();
    }
  }
};

module.exports = obj;
