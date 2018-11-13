export interface FriendsState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly friends: {}[];
};

export interface UserState {
  readonly loaded: boolean;
  readonly uid?: string;
  readonly email?: string;
}

export interface WishState {
  readonly wishes?: {}[];
  readonly uid: string;
}
