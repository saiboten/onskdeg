var firebase = require('./firebase/firebase');
var debug = require('debug')('User');

var userObj = {

  callback: undefined,

  getUserEmail(user) {
    var currentUser = firebase.auth().currentUser;
    debug('Returning current user: ', currentUser);
    if(currentUser) {
      return currentUser.email;
    }
    else {
      return null;
    }
  },
  getUserUid(user) {
    var currentUser = firebase.auth().currentUser;
    debug('Returning current user: ', currentUser);
    if(currentUser) {
      return currentUser.uid;
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
    userObj.callback(user.email);

    return firebase.database().ref('/userlist').once('value').then(function(snapshot) {
      var users = snapshot.val();
      debug("Users found in db: ", users);
      if(users == undefined) {
        debug("Creating user object and adding it", user, "Users: ", users);
        users = [];
        users.push({
          email: user.email,
          uid: user.uid
        });

        debug("Users to be stored", users);
        firebase.database().ref('/userlist').set(users);
      }
      else if(!users.includes(user.email)) {
        users.push({
          email: user.email,
          uid: user.uid
        });
        debug("Adding user ", user, "Users: ", users);
        firebase.database().ref('/userlist').set(users);
      }
    });

  }
});

module.exports = userObj;
