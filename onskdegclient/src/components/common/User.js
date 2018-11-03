import store from '../../store';

const userObj = {
  getUserUid() {
    return store.getState().userReducer.uid;
  },
  getUserEmail() {
    return store.getState().userReducer.email;
  },
};

export default userObj;
