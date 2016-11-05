var firebase = require('./firebase/firebase');
var debug = require('debug')('User');

var userObj = {

  callback: undefined,

  getUser(user) {
    var currentUser = firebase.auth().currentUser;
    debug('Returning current user: ', currentUser);
    if(currentUser) {
      return currentUser.email.split("@")[0];
    }
    else {
      return null;
    }
  },
  useThisCallback(func) {
    this.callback = func;
  }
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    debug('User auth state changed, user logged in: ', user);
    userObj.callback(user.email.split("@")[0]);
  }
});

module.exports = userObj;
