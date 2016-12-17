// @flow
import { compose, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage';
import logger from 'redux-logger';

import onskDegApp from './reducers';


function myCustomSlicer(paths) {
  return (state) => {
    const subset = state;
    return subset;
  };
}

/* const enhancer = compose(
  persistState('/', {
    slicer: myCustomSlicer,
  }),
); */

const enhancer = undefined;

const store = createStore(onskDegApp,
  enhancer);

module.exports = store;
