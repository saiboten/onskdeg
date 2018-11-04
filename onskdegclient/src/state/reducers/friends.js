
const initialState = {
  loaded: false,
  loading: false,
  friends: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_FRIENDS': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'FRIENDS_LOADED': {
      return {
        ...state,
        friends: action && action.data && action.data.filter(el => el),
        loading: false,
        loaded: true,
      };
    }
    default:
      return { ...state };
  }
};
