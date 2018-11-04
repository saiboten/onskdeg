// @flow

import firebase from './firebase';
import { setUser, userLoaded } from '../../state/actions/user';
import store from '../../store';

const debug = require('debug')('authFirebase');

const obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged((user, something) => {
      debug('onAuthStateChanged. User logged in: ', user, something);

      if (user) {
        store.dispatch(userLoaded());
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
        store.dispatch(userLoaded());
      }
    });
  },
};
export default obj;
