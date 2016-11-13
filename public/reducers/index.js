import { combineReducers } from 'redux'
import user from './user'
import allUserReducer from './allUserReducer'

const onskdegReducers = combineReducers({
  user,
  allUserReducer
})

export default onskdegReducers
