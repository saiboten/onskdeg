import {
    put, takeEvery, select,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import { user as userSelect } from '../selectors/selectors';

function* purchaseItem(input: any) {
    const currentUser = yield select(userSelect);
    const { uid, itemid } = input;
    firebase.database().ref(`purchases/${uid}/${itemid}`).set({
        checked: true,
        checkedby: currentUser.email,
        checkedtime: Date.now()
    })
}

function sellItem(input: any) {
    const { uid, itemid } = input;
    firebase.database().ref(`purchases/${uid}/${itemid}`).set({
        checked: false,
        checkedby: '',
        checkedtime: ''
    })
}

export function* purchaseSaga() {
    yield takeEvery('PURCHASE_ITEM', purchaseItem);
    yield takeEvery('SELL_ITEM', sellItem);
}