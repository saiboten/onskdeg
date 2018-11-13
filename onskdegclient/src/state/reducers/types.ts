export interface FriendsState {
  loaded: boolean;
  loading: boolean;
  friends: {}[];
};

export interface UserState {
  loaded: boolean;
  uid?: string;
  email?: string;
}

export interface SuggestionState {

}
