import { Wish, User } from "../../types/types";

export interface FriendsState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly friends: {}[];
  readonly userNotFound: boolean;
  readonly newFriend?: User;
};

export interface UserState {
  readonly loaded: boolean;
  readonly uid?: string;
  readonly email?: string;
}


export interface WishesDict {
  [key: string]: Wish
}
export interface WishState {
  [name: string]: Wish | {
    readonly uid?: string;
  }
}
