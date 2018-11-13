import { AnyAction } from "redux";

const initialState = {
  loaded: false,
};
const debug = require('debug')('userReducer');

export interface User {
  uid: string;
  email: string;
}

interface UserAction {
  type: string;
  user: User;
}
const userReducer = (state = initialState, action: UserAction) => {
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
