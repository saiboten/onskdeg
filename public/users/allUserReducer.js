
const debug = require('debug')('allUserReducer');

const initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERLIST':
      return action.userList;
    default:
      return state;
  }
};

export default userReducer;
