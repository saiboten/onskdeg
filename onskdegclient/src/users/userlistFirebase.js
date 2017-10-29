// @flow

import store from '../store';
import setUserlist from './userlistactions';
import firebase from '../firebase/firebase';

const debug = require('debug')('userlistFirebase');

let fbdb;

const obj = {
  subscribe() {
    debug('subscribe');
    const db = firebase.database();
    fbdb = db.ref('userlist').on('value', (userlistdb) => {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  },
  unsubscribe() {
    debug('unsubscribe');

    if (fbdb) {
      debug('fbdb', fbdb);
      fbdb.off();
    }
  }
};

export default obj;
