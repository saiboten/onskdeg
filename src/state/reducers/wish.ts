import { Reducer } from 'redux';
import { WishState } from './types';

const initialState: WishState = {};

const userReducer: Reducer<WishState> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_WISHES': {
      return Object.assign({}, action.wishes);
    }
    case 'SET_USER_WISHES': {
      const { uid } = action;
      return {
        ...state,
        [uid]: action.wishes,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
