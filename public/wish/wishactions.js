export const setAllWishes = (wishes) => {
  return {
    type: 'SET_ALL_WISHES',
    wishes
  }
}

export const setWishes = (user,wishes) => {
  return {
    type: 'SET_WISHES_SINGLE_USER',
    wishes,
    user
  }
}

export const deleteWish = (user,wishId) => {
  return {
    type: 'DELETE_WISH',
    wishId,
    user
  }
}

export const addWish = (user,wish) => {
  return {
    type: 'ADD_WISH',
    wish,
    user
  }
}

export const checkWish = (user,wish) => {
  return {
    type: 'CHECK_WISH',
    wish,
    user
  }
}
