var firebase = require('./firebase/firebase');
var debug = require('debug')('User');
import store from '../store';
import { setUser } from '../actions/useractions';

var userObj = {
  getUserUid() {
    return store.getState().user.uid;
  },
  getUserEmail() {
    return store.getState().user.email;
  }
}

module.exports = userObj;
