import {
    put, takeEvery, select, call,
} from 'redux-saga/effects';
import firebase from '../../components/firebase/firebase';
import { user as userSelect, friends as friendsSelect } from '../selectors/selectors';
import { User } from '../../types/types';

function getUserList(currentUser: User) {
    return new Promise(((resolve) => {
        firebase.database().ref(`users/${currentUser.uid}/friends`).once('value', (snapshot) => {
            if (snapshot == null) {
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

function getFriendByEmail(mail: string) {
    return new Promise((resolve, reject) => {
        firebase.database().ref(`users`).once('value', (snapshot) => {
            if (snapshot == null) {
                return;
            }
            const usersObj = snapshot.val();
            const userlistKeys = Object.keys(usersObj);
            const userlist = userlistKeys.map(key => usersObj[key]);

            const filteredList: Array<User> = userlist.filter((user: User) => user.email === mail);

            if (filteredList.length == 1) {
                resolve(filteredList.reduce((e: User) => e));
            }
            else {
                resolve();
            }
        });
    });
}

function* addFriend(input: any) {
    const user = yield select(userSelect);
    const friends = yield select(friendsSelect);
    const { uid } = user;
    const { newFriendMail }: { newFriendMail: string } = input;
    const newFriend = yield getFriendByEmail(newFriendMail);
    if (newFriend) {
        const newUserList = [newFriend, ...friends];
        firebase.database().ref(`users/${uid}/friends`).set(newUserList);
        yield put({ type: 'FRIEND_FOUND_AND_ADDED', newFriend });
    }
    else {
        yield put({ type: 'FRIEND_NOT_FOUND' });
    }

}

function* deleteFriend(input: any) {
    const user = yield select(userSelect);
    const friends = yield select(friendsSelect);
    const { uid } = user;
    const { email } = input;

    const newUserList = friends.filter((friend: User) => friend.email !== email);
    firebase.database().ref(`users/${uid}/friends`).set(newUserList);
}

function* setNameAndEmail(input: any) {
    const { name, email } = input;

    const user = yield select(userSelect);
    firebase.database().ref(`users/${user.uid}/name`).set(name);
    if (email) {
        firebase.database().ref(`users/${user.uid}/email`).set(email);
    }
    yield put({
        type: 'USER_LOADED',
        user: {
            ...user,
            name
        }
    });
}

export function* userSaga() {
    yield takeEvery('LOAD_FRIENDS', loadUserList);
    yield takeEvery('ADD_FRIEND', addFriend);
    yield takeEvery('DELETE_FRIEND', deleteFriend);
    yield takeEvery('SET_NAME_AND_EMAIL', setNameAndEmail);
}

