import { Wish } from "../../types/types";

export const addSuggestion = (wishSuggestion: Wish, suggestedBy: string, suggestedTo: string, id: string) => (
  {
    type: 'ADD_SUGGESTION',
    wishSuggestion,
    suggestedBy,
    suggestedTo,
    id,
  }
);

export const checkSuggestion = (suggestedTo: string, id: string, checkedBy: string) => (
  {
    type: 'CHECK_SUGGESTION',
    suggestedTo,
    id,
    checkedBy,
  }
);

export const setSuggestions = (suggestions: any) => (
  {
    type: 'SET_SUGGESTIONS',
    suggestions,
  }
);

export const deleteSuggestion = (userid: string, idToBeDeleted: string) => (
  {
    type: 'DELETE_SUGGESTION',
    userid,
    idToBeDeleted,
  }
);
