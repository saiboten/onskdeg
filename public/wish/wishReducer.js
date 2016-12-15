
const debug = require('debug')('wishReducer');

const initialState = {};

const userReducer = (state = initialState/* : Object*/, action/* : Object*/) => {
  let returnThis;
  switch (action.type) {
    case 'SET_ALL_WISHES': {
      returnThis = Object.assign({}, action.wishes);
      break;
    }
    case 'SET_WISHES_SINGLE_USER': {
      returnThis = Object.assign({}, state);
      break;
    }
    default:
      returnThis = state;
  }
  return returnThis;
};

export default userReducer;
