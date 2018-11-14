import { Wish } from "../../types/types";

export const setWishes = (wishes: Array<Wish>) => (
  {
    type: 'SET_OWN_WISHES',
    wishes,
  }
);

export const setWishesForUser = (data: any) => (
  {
    type: 'SET_USER_WISHES',
    ...data,
  }
);
