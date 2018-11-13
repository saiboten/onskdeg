// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';


import reducer from './state/reducers';
import mySaga from './state/sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
  reducer, /* preloadedState, */
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(mySaga);

export default store;
