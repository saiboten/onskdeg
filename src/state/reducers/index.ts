import { combineReducers } from 'redux';
import user from './user';
// import suggestion from './suggestion';
import wish from './wish';
import friends from './friends';
import purchase from './purchase';
import { UserState, WishState, FriendsState, PurchaseState } from './types';

export interface ApplicationState {
  user: UserState,
  wish: WishState,
  friends: FriendsState,
  purchase: PurchaseState
} 

const onskdegReducers = combineReducers<ApplicationState>({
  user,
  // suggestion,
  wish,
  friends,
  purchase
} as any);

export default onskdegReducers;
