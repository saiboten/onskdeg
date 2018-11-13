
// const debug = require('debug')('wishReducer');

const initialState = {};

interface UserAction {
  type: string;
  wishes: {};
  uid: string;
}
const userReducer = (state = initialState, action: UserAction) => {
  let returnThis;
  switch (action.type) {
    case 'SET_ALL_WISHES': {
      returnThis = Object.assign({}, action.wishes);
      break;
    }
    case 'SET_USER_WISHES': {
      const { uid, wishes } = action;
      return {
        ...state,
        [uid]: wishes,
      };
    }
    default:
      returnThis = state;
  }
  return returnThis;
};

export default userReducer;
