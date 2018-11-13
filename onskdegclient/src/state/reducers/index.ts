import { combineReducers } from 'redux';
import user from './user';
import suggestion from './suggestion';
import wish from './wish';
import friends from './friends';

const onskdegReducers = combineReducers({
  user,
  suggestion,
  wish,
  friends,
} as any);

export default onskdegReducers;
