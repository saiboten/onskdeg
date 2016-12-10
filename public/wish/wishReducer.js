// @flow
let debug = require('debug')('wishReducer');
let initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_WISHES':
      return Object.assign({},action.wishes);
      case 'SET_WISHES_SINGLE_USER':
        var newState = Object.assign({}, state);
        Object.keys(newState);

    default:
      return state
  }
}

export default userReducer
