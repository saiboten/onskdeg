import {
  put, takeEvery, select, takeLatest,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import { user as userSelect, friends as friendsSelect } from '../selectors/selectors';
import { setWishesForUser, storeWishesToFirebase } from '../actions/wish';
import { Wish } from '../../types/types';

function* setOwnWishes(input: any) {
  const { wishes } = input;
  const { uid } = yield select(userSelect);

  yield put(setWishesForUser({ uid, wishes }));
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

function* storeDescriptionToFirebase(input: any) {
  const currentUser = yield select(userSelect);
  const { uid } = currentUser;
  const { description, wishid } = input;
  firebase.database().ref(`wishes/${uid}/wishes`).once('value', (snapshot: any) => {
    const wishList = snapshot.val();
    const newWishList = wishList.map((el: any) => {
      const { checked, checkedby, ...rest} = el;
      
      if(el.id !== wishid) {
        return rest;
      }

      return {
        ...rest,
        description
      }
    })
    firebase.database().ref(`wishes/${uid}/wishes`).set(newWishList);
  });
  

}

export function* wishSaga() {
  yield takeEvery('SET_OWN_WISHES', setOwnWishes);
  yield takeEvery('STORE_WISHES_TO_FIREBASE', storeWishes);
  yield takeEvery('STORE_OWN_WISHES_TO_FIREBASE', storeWishesToFirebaseSaga);
  yield takeLatest('STORE_DESCRIPTION_TO_FIREBASE', storeDescriptionToFirebase);
}
