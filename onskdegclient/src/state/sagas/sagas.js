import {
  put, takeEvery, select, call,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import getCurrentUser from '../selectors/getCurrentUser';

function myPromise(currentUser) {
  return new Promise(((resolve) => {
    firebase.database().ref(`users/${currentUser.uid}/users`).on('value', (snapshot) => {
      const resolveVal = snapshot.val();
      resolve(resolveVal);
    });
  }));
}

function* loadUserList() {
  const currentUser = yield select(getCurrentUser);
  const data = yield call(myPromise, currentUser);
  yield put({ type: 'FRIENDS_LOADED', data });
}

function* mySaga() {
  yield takeEvery('LOAD_FRIENDS', loadUserList);
}

export default mySaga;
