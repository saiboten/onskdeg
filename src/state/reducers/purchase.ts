import { Reducer } from 'redux';
import { PurchaseState } from './types';

const initialState: PurchaseState = {
  loading: false,
  purchases: {

  }
};

const purchaseReducer: Reducer<PurchaseState> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_STARTED': {
      return {
        ...state,
        loading: true
      }
    }
    case 'SET_USER_PURCHASES': {
      const { uid, purchases } = action;
      return {
        ...state,
        purchases: {
            ...state.purchases,
            [uid]: purchases,
        }
      };
    }
    default:
      return state;
  }
};

export default purchaseReducer;
