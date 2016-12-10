// @flow
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    user
  }
}

export const logout = () => {
  return {
    type: 'LOG_OUT'
  }
}
