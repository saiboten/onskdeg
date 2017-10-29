export const addSuggestion = (wishSuggestion, suggestedBy, suggestedTo, id) => (
  {
    type: 'ADD_SUGGESTION',
    wishSuggestion,
    suggestedBy,
    suggestedTo,
    id
  }
);

export const checkSuggestion = (suggestedTo, id, checkedBy) => (
  {
    type: 'CHECK_SUGGESTION',
    suggestedTo,
    id,
    checkedBy
  }
);

export const setSuggestions = suggestions => (
  {
    type: 'SET_SUGGESTIONS',
    suggestions
  }
);

export const deleteSuggestion = (userid, idToBeDeleted) => (
  {
    type: 'DELETE_SUGGESTION',
    userid,
    idToBeDeleted
  }
);
