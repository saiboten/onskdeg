import { Reducer } from 'redux';
import { FriendsState } from './types';

const initialState: FriendsState = {
  loaded: false,
  loading: false,
  friends: [],
  userNotFound: false,
  newFriend: undefined
};

const reducer: Reducer<FriendsState> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_FRIENDS': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'SET_FRIENDS': {
      return {
        ...state,
        friends: action.newFriendList != null ? action.newFriendList : [],
      };
    }
    case 'FRIENDS_LOADED': {
      return {
        ...state,
        friends: action.data != null ? action.data : [],
        loading: false,
        loaded: true,
      };
    }
    case 'FRIEND_NOT_FOUND': {
      return {
        ...state,
        userNotFound: true
      };
    }
    default:
      return { ...state };
  }
};

export default reducer;