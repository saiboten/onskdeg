export const userLoaded = user => (
  {
    type: 'USER_LOADED',
    user,
  }
);

export const logout = () => (
  {
    type: 'LOG_OUT',
  }
);
