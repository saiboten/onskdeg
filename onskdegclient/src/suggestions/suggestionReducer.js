
const initialState = {

};

const debug = require('debug')('suggestionReducer');

const suggestionReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_SUGGESTION': {
      newState = Object.assign({}, state);
      if (!newState[action.suggestedTo]) {
        newState[action.suggestedTo] = [];
      }
      newState[action.suggestedTo].push({
        id: action.id,
        wishSuggestion: action.wishSuggestion,
        suggestedBy: action.suggestedBy,
        checked: false,
        checkedBy: ''
      });
      debug('Old state: ', state, '. New state: ', newState);
      break;
    }
    case 'CHECK_SUGGESTION': {
      debug('Checking suggestion, action: ', action);
      newState = Object.assign({}, state);

      newState[action.suggestedTo] = newState[action.suggestedTo].map((el) => {
        const newElement = Object.assign({}, el);
        if (el.id === action.id) {
          debug('Found the right id: ', el.id);
          newElement.checked = !el.checked;
          newElement.checkedBy = action.checkedBy;
        }
        debug('New suggestion values: ', newElement);
        return newElement;
      });
      debug('Old state: ', state, '. New state: ', newState);
      break;
    }
    case 'SET_SUGGESTIONS': {
      newState = Object.assign({}, action.suggestions);
      break;
    }
    case 'DELETE_SUGGESTION':
      newState = Object.assign({}, state);
      newState[action.userid] = newState[action.userid].filter((el) => {
        if (el.id === action.idToBeDeleted) {
          return false;
        }
        return true;
      });
      debug('Old state: ', state, 'New state: ', newState);
      return newState;
    default: {
      newState = state;
    }

  }
  return newState;
};

export default suggestionReducer;
