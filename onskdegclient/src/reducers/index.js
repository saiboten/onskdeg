// @flow
import { combineReducers } from 'redux';
import user from '../user/userReducer';
import users from '../users/allUserReducer';
import suggestion from '../suggestions/suggestionReducer';
import wish from '../wish/wishReducer';

const onskdegReducers = combineReducers({
  user,
  users,
  suggestion,
  wish
});

export default onskdegReducers;
