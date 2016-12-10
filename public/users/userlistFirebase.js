// @flow
var debug = require('debug')('userlistListener');

import store from '../store';
import {setUserlist} from './userlistactions';
import firebase from '../firebase/firebase';

let fbdb = undefined;

var obj = {
  subscribe() {
    debug('subscribe');
    fbdb = firebase.database();
    fbdb.ref('userlist').on('value', userlistdb => {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  },
  unsubscribe() {
    debug('unsubscribe');

    if(fbdb) {
      fbdb.off();
    }
  }
};

module.exports = obj;
