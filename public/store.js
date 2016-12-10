// @flow
import onskDegApp from './reducers'
import { compose, createStore } from 'redux'
import persistState from 'redux-localstorage'

function myCustomSlicer (paths) {
  return (state) => {
    let subset = state;
    return subset
  }
}

const enhancer = compose(
  persistState('/', {
    slicer: myCustomSlicer
  }),
)

let store = createStore(onskDegApp, enhancer);

module.exports = store;
