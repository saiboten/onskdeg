import { combineReducers } from 'redux'
import userReducer from './userReducer'
import allUserReducer from './allUserReducer'
import suggestionReducer from './suggestionReducer'

const onskdegReducers = combineReducers({
  userReducer,
  allUserReducer,
  suggestionReducer
})

export default onskdegReducers
