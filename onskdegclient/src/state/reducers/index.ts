// @flow
import { combineReducers } from 'redux';
import user, { User } from './user';
import suggestion from './suggestion';
import wish from './wish';
import friends from './friends';

export interface RootState {
  user: User;
  suggestion: {};
  wish: {};
  friends: {};
}
const onskdegReducers = combineReducers({
  user,
  suggestion,
  wish,
  friends,
} as any);

export default onskdegReducers;
