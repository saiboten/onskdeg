// @flow

import firebase from '../firebase/firebase';
import { setUser } from '../user/useractions';
import store from '../store';

const debug = require('debug')('authListener');

const obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged((user) => {
      debug('onAuthStateChanged. User logged in: ', user);

      if (user) {
        store.dispatch(setUser(user));

        firebase.database().ref('/userlist').once('value').then((snapshot) => {
          let users = snapshot.val();

          const userExists = users.filter(el => el.email === user.email).length === 0;

          if (users === undefined) {
            users = [];

            users.push({
              email: user.email,
              uid: user.uid,
            });

            debug('Users to be stored after new user added', users);
            firebase.database().ref('/userlist').set(users);
          } else if (userExists) {
            users.push({
              email: user.email,
              uid: user.uid,
            });
            debug('Adding user ', user, 'Users: ', users);
            firebase.database().ref('/userlist').set(users);
          }
        });
      } else {
        store.dispatch(setUser({}));
      }
    });
  },
};
module.exports = obj;
