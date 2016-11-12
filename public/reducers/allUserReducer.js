var debug = require('debug')('allUserReducer');
let initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.user;
    default:
      return state
  }
}

export default userReducer
