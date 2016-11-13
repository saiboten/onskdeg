import store from '../store';
import {setUserlist} from '../actions/userlistactions';
var firebase = require('../common/firebase/firebase');
var debug = require('debug')('userlistListener');

var obj = {
  setupUserlistListener() {
    firebase.database().ref('userlist').on('value',function(userlistdb) {
      store.dispatch(setUserlist(userlistdb.val()));
    });
  }
};

module.exports = obj;
