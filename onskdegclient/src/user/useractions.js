// @flow
export const setUser = user /* : Object */ => (
  {
    type: 'SET_USER',
    user
  }
);

export const logout = () => (
  {
    type: 'LOG_OUT'
  }
);
