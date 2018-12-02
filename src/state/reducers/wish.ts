import { Reducer } from 'redux';
import { WishState } from './types';

const initialState: WishState = {
  loading: false,
  wishes: {

  }
};

const userReducer: Reducer<WishState> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_STARTED': {
      return {
        ...state,
        loading: true
      }
    }
    case 'SET_USER_WISHES': {
      const { uid, wishes } = action;
      return {
        ...state,
        wishes: {
          [uid]: action.wishes,
        }
      };
    }
    default:
      return state;
  }
};

export default userReducer;
