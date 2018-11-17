import {
  put, takeEvery, select, call,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import { user as userSelect, friends as friendsSelect } from '../selectors/selectors';
import { setWishesForUser, storeWishesToFirebase } from '../actions/wish';
import { User, Wish } from '../../types/types';

function getUserList(currentUser: User) {
  return new Promise(((resolve) => {
    firebase.database().ref(`users/${currentUser.uid}/users`).on('value', (snapshot) => {
      if(snapshot == null) {
        return;
      }
      const resolveVal = snapshot.val();
      resolve(resolveVal);
    });
  }));
}

function* loadUserList() {
  const currentUser = yield select(userSelect);
  const data = yield call(getUserList, currentUser);
  yield put({ type: 'FRIENDS_LOADED', data });
}

function* setOwnWishes(input: any) {
  const { wishes } = input;
  const { uid } = yield select(userSelect);

  yield put(setWishesForUser({ uid, wishes }));
}

interface StoreWishInput {
  uid: string;
  wishes: Array<Wish>;
}

function storeWishes(input: any) {
  const { uid, wishes } = input;
  firebase.database().ref(`wishes/${uid}/wishes`).set(wishes);
}

function* storeWishesToFirebaseSaga(input: any) {
  const currentUser = yield select(userSelect);
  const { uid } = currentUser;
  const { wishes } = input;
  yield put(storeWishesToFirebase(uid, wishes));
}

function* deleteFriend(input: any) {
  const user = yield select(userSelect);
  const friends = yield select(friendsSelect);
  const { uid } = user;
  const { email } = input;

  const newUserList = friends.filter((friend: User) => friend.email !== email);
  firebase.database().ref(`users/${uid}/users`).set(newUserList);
}

function* mySaga() {
  yield takeEvery('LOAD_FRIENDS', loadUserList);
  yield takeEvery('SET_OWN_WISHES', setOwnWishes);
  yield takeEvery('STORE_WISHES_TO_FIREBASE', storeWishes);
  yield takeEvery('STORE_OWN_WISHES_TO_FIREBASE', storeWishesToFirebaseSaga);
  yield takeEvery('DELETE_FRIEND', deleteFriend);
}

export default mySaga;
