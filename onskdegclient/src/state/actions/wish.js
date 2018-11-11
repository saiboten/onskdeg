
export const setWishes = wishes => (
  {
    type: 'SET_OWN_WISHES',
    wishes,
  }
);

export const setWishesForUser = data => (
  {
    type: 'SET_USER_WISHES',
    ...data,
  }
);
