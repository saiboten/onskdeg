import { combineReducers } from 'redux'
import userReducer from './userReducer'
import allUserReducer from './allUserReducer'

const onskdegReducers = combineReducers({
  userReducer,
  allUserReducer
})

export default onskdegReducers
