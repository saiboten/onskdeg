import onskDegApp from './reducers'
import { createStore } from 'redux'

let store = createStore(onskDegApp);

module.exports = store;
