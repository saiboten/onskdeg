export const addSuggestion = (wishSuggestion,suggestedBy, suggestedTo, id) => {
  return {
    type: 'ADD_SUGGESTION',
    wishSuggestion,
    suggestedBy,
    suggestedTo,
    id
  }
}

export const checkSuggestion = (suggestedTo, id, checkedBy) => {
  return {
    type: 'CHECK_SUGGESTION',
    suggestedTo,
    id,
    checkedBy
  }
}

export const setSuggestions = (suggestions) => {
  return {
    type: 'SET_SUGGESTIONS',
    suggestions
  }
}


export const deleteSuggestion = (userid, idToBeDeleted) => {
  return {
    type: 'DELETE_SUGGESTION',
    userid,
    idToBeDeleted
  }
}
