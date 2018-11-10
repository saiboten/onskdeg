
export const setAllWishes = wishes => (
  {
    type: 'SET_ALL_WISHES',
    wishes,
  }
);

export const setWishes = wishes => (
  {
    type: 'SET_WISHES_SINGLE_USER',
    wishes,
  }
);

export const deleteWish = (user, wishId) => (
  {
    type: 'DELETE_WISH',
    wishId,
    user,
  }
);

export const addWish = (user, wish) => (
  {
    type: 'ADD_WISH',
    wish,
    user,
  }
);

export const checkWish = (user, wish) => (
  {
    type: 'CHECK_WISH',
    wish,
    user,
  }
);
