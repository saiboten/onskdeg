import { Reducer } from "redux";
import { UserState } from "./types";

const initialState: UserState = {
  loaded: false,
  uid: undefined,
  email: undefined
};
const debug = require('debug')('userReducer');


const userReducer: Reducer<UserState> = (state = initialState, action) => {
  debug('Input: state: ', state, '. Action: ', action);

  switch (action.type) {
    case 'USER_LOADED': {
      if (action.user) {
        const { uid, email } = action.user;
        return {
          ...state,
          uid,
          email,
          loaded: true,
        };
      }
      return {
        ...state,
        loaded: true,
      };
    }
    case 'LOG_OUT': {
      return initialState;
    }
    default:
      return { ...state };
  }
};

export default userReducer;
