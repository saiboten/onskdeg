
let debug = require('debug')('allUserReducer');

let initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERLIST':
      return action.userList;
    default:
      return state
  }
}

export default userReducer
