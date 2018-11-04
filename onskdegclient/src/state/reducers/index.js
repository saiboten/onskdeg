// @flow
import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import suggestion from './suggestion';
import wish from './wish';
import friends from './friends';

const onskdegReducers = combineReducers({
  user,
  users,
  suggestion,
  wish,
  friends,
});

export default onskdegReducers;
