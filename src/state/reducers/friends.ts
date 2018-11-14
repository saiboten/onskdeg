import { Reducer } from 'redux';
import { FriendsState } from './types';

const initialState: FriendsState = {
  loaded: false,
  loading: false,
  friends: [],
};

const reducer: Reducer<FriendsState> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_FRIENDS': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'FRIENDS_LOADED': {
      return {
        ...state,
        friends: action && action.data && action.data.filter((el:any) => el),
        loading: false,
        loaded: true,
      };
    }
    default:
      return { ...state };
  }
};

export default reducer;