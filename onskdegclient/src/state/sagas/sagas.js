import {
  put, takeEvery, select, call,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import getCurrentUser from '../selectors/getCurrentUser';
import { setWishesForUser } from '../actions/wish';

function getUserList(currentUser) {
  return new Promise(((resolve) => {
    firebase.database().ref(`users/${currentUser.uid}/users`).on('value', (snapshot) => {
      const resolveVal = snapshot.val();
      resolve(resolveVal);
    });
  }));
}

function* loadUserList() {
  const currentUser = yield select(getCurrentUser);
  const data = yield call(getUserList, currentUser);
  yield put({ type: 'FRIENDS_LOADED', data });
}

function* setOwnWishes({ wishes }) {
  const { uid } = yield select(getCurrentUser);

  yield put(setWishesForUser({ uid, wishes }));
}

function* mySaga() {
  yield takeEvery('LOAD_FRIENDS', loadUserList);
  yield takeEvery('SET_OWN_WISHES', setOwnWishes);
}

export default mySaga;
