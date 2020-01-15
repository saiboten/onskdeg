import { User } from "../../types/types";

export const loadFriends = () => ({
  type: "LOAD_FRIENDS"
});

export const addFriend = (newFriendMail: string) => ({
  type: "ADD_FRIEND",
  newFriendMail
});

export const deleteFriend = (email: string | null) => ({
  type: "DELETE_FRIEND",
  email
});

export const setFriends = (newFriendList: Array<User>) => ({
  type: "SET_FRIENDS",
  newFriendList
});
