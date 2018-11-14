import firebase from './firebase';
import { userLoaded } from '../../state/actions/user';
import store from '../../store';
import { User, FirebaseSnapshot } from '../../types/types';

const debug = require('debug')('authFirebase');

const obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged((user: User) => {
      debug('onAuthStateChanged. User logged in: ', user);

      if (user) {
        store.dispatch(userLoaded(user));

        firebase.database().ref('/userlist').once('value').then((snapshot: FirebaseSnapshot) => {
          let users = snapshot.val();

          const userExists = users.filter((el: User) => el.email === user.email).length === 0;

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
        store.dispatch(userLoaded(null));
      }
    });
  },
};
export default obj;
