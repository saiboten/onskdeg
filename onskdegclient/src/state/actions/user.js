export const userLoaded = () => (
  {
    type: 'USER_LOADED',
  }
);

export const setUser = user => (
  {
    type: 'SET_USER',
    user,
  }
);

export const logout = () => (
  {
    type: 'LOG_OUT',
  }
);
