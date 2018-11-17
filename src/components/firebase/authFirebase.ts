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
      } else {
        store.dispatch(userLoaded(null));
      }
    });
  },
};
export default obj;
