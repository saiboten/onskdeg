var firebase = require('./firebase/firebase');
var debug = require('debug')('User');
import store from '../store';
import { setUser } from '../actions/useractions';

var userObj = {
  getUserUid() {
    return store.getState().userReducer.uid;
  },
  getUserEmail() {
    return store.getState().userReducer.email;
  }
}

module.exports = userObj;
