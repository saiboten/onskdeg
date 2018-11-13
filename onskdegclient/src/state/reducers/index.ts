import { combineReducers } from 'redux';
import user from './user';
// import suggestion from './suggestion';
import wish from './wish';
import friends from './friends';
import { UserState, WishState, FriendsState } from './types';

export interface ApplicationState {
  user: UserState,
  wish: WishState,
  friends: FriendsState
} 

const onskdegReducers = combineReducers<ApplicationState>({
  user,
  // suggestion,
  wish,
  friends,
} as any);

export default onskdegReducers;
