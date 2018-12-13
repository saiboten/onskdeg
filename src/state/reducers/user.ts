import { Reducer } from "redux";
import { UserState } from "./types";

const initialState: UserState = {
  loaded: false,
  uid: undefined,
  email: undefined
};

const userReducer: Reducer<UserState> = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOADED': {
      if (action.user) {
        const { uid, email, name } = action.user;
        return {
          ...state,
          uid,
          email,
          name,
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
