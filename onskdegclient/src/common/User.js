// @flow
import store from '../store';
import { setUser } from '../user/useractions';

var debug = require('debug')('User');

let userObj = {
  getUserUid() {
    return store.getState().userReducer.uid;
  },
  getUserEmail() {
    return store.getState().userReducer.email;
  }
}

export default userObj;
