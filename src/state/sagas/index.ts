import { put, takeEvery, all } from 'redux-saga/effects';
import { userSaga } from './usersaga';
import { wishSaga } from './wishsaga';

export default function* rootSaga() {
    yield all([
      userSaga(),
      wishSaga()
    ])
  }