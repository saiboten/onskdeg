import { Wish } from "../../types/types";

export const setWishes = (wishes: Array<Wish>) => (
  {
    type: 'SET_OWN_WISHES',
    wishes,
  }
);

export const storeOwnWishesToFirebase = (wishes: Array<Wish>) => (
  {
    type: 'STORE_OWN_WISHES_TO_FIREBASE',
    wishes,
  }
);

export const storeWishesToFirebase = (uid: string, wishes: Array<Wish>) => (
  {
    type: 'STORE_WISHES_TO_FIREBASE',
    uid,
    wishes,
  }
);

export const setWishesForUser = (data: any) => (
  {
    type: 'SET_USER_WISHES',
    ...data,
  }
);
