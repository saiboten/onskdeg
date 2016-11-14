var firebase = require('../common/firebase/firebase');
var debug = require('debug')('authListener');
import store from '../store';
import { setUser } from '../actions/useractions'

var obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        debug('User auth state changed, user logged in: ', user);

        store.dispatch(setUser(user));

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
          else if(users.filter(el=> { return el.email == user.email}).length === 0) {
            users.push({
              email: user.email,
              uid: user.uid
            });
            debug("Adding user ", user, "Users: ", users);
            firebase.database().ref('/userlist').set(users);
          }
        });

      }
      else {
        store.dispatch(setUser({}));
      }
    });
  }
}
module.exports = obj;
