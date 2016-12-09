let debug = require('debug')('authListener');

import firebase from '../firebase/firebase';
import store from '../store';
import { setUser } from '../user/useractions'

let obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged(function(user) {
      debug('onAuthStateChanged. User logged in: ', user);

      if (user) {
        store.dispatch(setUser(user));

        return firebase.database().ref('/userlist').once('value').then(function(snapshot) {
          var users = snapshot.val();
          if(users === undefined) {
            users = [];

            users.push({
              email: user.email,
              uid: user.uid
            });

            debug("Users to be stored after new user added", users);
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
