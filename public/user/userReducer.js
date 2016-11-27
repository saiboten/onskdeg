let initialState = {};
var debug = require('debug')('userReducer');

const userReducer = (state = initialState, action) => {
  debug("Input: state: ", state, ". Action: ", action);

  switch (action.type) {
    case 'SET_USER':
      var newuser = Object.assign({});
      newuser.uid = action.user.uid;
      newuser.email = action.user.email;
      debug("Output state: ", newuser);
      return newuser;
      case 'LOG_OUT':
        return initialState;
    case 'SET_USERNAME':
      return Object.assign({
        name: action.name
      }, state);
    default:
      return state
  }
}

export default userReducer
