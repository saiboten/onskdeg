import { put, takeEvery, all } from 'redux-saga/effects';
import { userSaga } from './usersaga';
import { wishSaga } from './wishsaga';
import { purchaseSaga } from './purchases';

export default function* rootSaga() {
    yield all([
      userSaga(),
      wishSaga(),
      purchaseSaga()
    ])
  }