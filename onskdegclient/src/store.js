// @flow
import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import reducer from './reducers';

function myCustomSlicer(paths) {
  return (state) => {
    const subset = state;
    return subset;
  };
}
/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

export default store;
