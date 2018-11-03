// @flow
import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import suggestion from './suggestion';
import wish from './wish';

const onskdegReducers = combineReducers({
  user,
  users,
  suggestion,
  wish
});

export default onskdegReducers;
