
let initialState = {

};

let debug = require('debug')('suggestionReducer');

const suggestionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SUGGESTION':
      let newState = Object.assign({}, state);
      if(!newState[action.suggestedTo]) {
        newState[action.suggestedTo] = [];
      }
      newState[action.suggestedTo].push({
        id: action.id,
        wishSuggestion: action.wishSuggestion,
        suggestedBy: action.suggestedBy,
        checked: false,
        checkedBy: ''
      });
      debug("Old state: ", state, ". New state: ", newState);
      return newState;
    case 'CHECK_SUGGESTION':
      debug("Checking suggestion, action: ", action);
      let anotherNewState = Object.assign({}, state);

      anotherNewState[action.suggestedTo] = anotherNewState[action.suggestedTo].map(el => {
        if(el.id === action.id) {
          debug('Found the right id: ', el.id);
          el.checked = !el.checked;
          el.checkedBy = action.checkedBy;
        }
        debug("New suggestion values: ", el);
        return el;
      });
      debug("Old state: ", state, ". New state: ", anotherNewState);
      return anotherNewState;
    case 'SET_SUGGESTIONS':
      var newState = Object.assign({}, action.suggestions);
      return newState;
    case 'DELETE_SUGGESTION':
      var newState = Object.assign({}, state);
      newState[action.userid] = newState[action.userid].filter(el => {
        if(el.id === action.idToBeDeleted) {
          return false
        }
        return true;
      });
      debug("Old state: ", state, "New state: ", newState);
      return newState;
    default:
      return state
  }
}

export default suggestionReducer
