import { combineReducers } from 'redux'
import userReducer from '../user/userReducer'
import allUserReducer from '../users/allUserReducer'
import suggestionReducer from '../suggestions/suggestionReducer'
import wishReducer from '../wish/wishReducer'


const onskdegReducers = combineReducers({
  userReducer,
  allUserReducer,
  suggestionReducer,
  wishReducer
})

export default onskdegReducers
