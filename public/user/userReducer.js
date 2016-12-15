
const initialState = {};
const debug = require('debug')('userReducer');

const userReducer = (state = initialState, action) => {
  let returnThis;
  debug('Input: state: ', state, '. Action: ', action);

  switch (action.type) {
    case 'SET_USER': {
      returnThis = Object.assign({});
      returnThis.uid = action.user.uid;
      returnThis.email = action.user.email;
      debug('Output state: ', returnThis);
      break;
    }
    case 'LOG_OUT': {
      returnThis = initialState;
      break;
    }
    default:
      returnThis = state;
  }
  return returnThis;
};

export default userReducer;
