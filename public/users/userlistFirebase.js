// @flow

import store from '../store';
import { setUserlist } from './userlistactions';
import firebase from '../firebase/firebase';

const debug = require('debug')('userlistFirebase');

let fbdb;

const obj = {
  subscribe() {
    debug('subscribe');
    fbdb = firebase.database();
    fbdb.ref('userlist').on('value', (userlistdb) => {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  },
  unsubscribe() {
    debug('unsubscribe');

    if (fbdb) {
      fbdb.off();
    }
  },
};

module.exports = obj;
