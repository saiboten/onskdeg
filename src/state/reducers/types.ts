import { Wish, User, Purchases } from "../../types/types";

export interface PurchaseState {
  readonly loading: boolean;
  readonly purchases: {
    [key: string]: Purchases;
  }
}

export interface FriendsState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly friends: Array<User>;
  readonly userNotFound: boolean;
  readonly newFriend?: User;
};

export interface UserState {
  readonly loaded: boolean;
  readonly uid?: string;
  readonly email?: string;
  readonly name?: string;
}

export interface WishesDict {
  [key: string]: Wish
}
export interface WishState {
  loading: boolean;
  wishes: {
    [name: string]: Wish | {
      readonly uid?: string;
    }
  }
  
}
