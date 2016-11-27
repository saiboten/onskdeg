import store from '../store';
import {setUserlist} from './userlistactions';
var firebase = require('../firebase/firebase');
var debug = require('debug')('userlistListener');

var obj = {
  setupUserlistListener() {
    firebase.database().ref('userlist').on('value', userlistdb => {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  }
};

module.exports = obj;
