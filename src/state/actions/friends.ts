import { User } from "../../types/types";

export const loadFriends = () => ({
  type: 'LOAD_FRIENDS',
});

export const deleteFriend = (email: string) => ({
  type: 'DELETE_FRIEND',
  email
})

export const setFriends = (newFriendList: Array<User>) => ({
  type: "SET_FRIENDS",
  newFriendList
})