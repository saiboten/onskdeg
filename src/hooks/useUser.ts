import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

async function fetchUser(userId: string): Promise<User> {
  if (userId === "") {
    return {
      uid: "",
      groups: [],
      isChild: false,
    };
  }

  const userDoc = firebase.firestore().collection("user").doc(userId);
  const userData = await userDoc.get();

  if (userData.exists) {
    return {
      uid: "",
      childs: [],
      groups: [],
      isChild: false,
      ...userData.data(),
    };
  }

  const newUser = {
    uid: userId,
    childs: [],
    groups: [],
    isChild: false,
  };
  await userDoc.set(newUser);
  return newUser;
}

export function useUser(user: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["user", user],
    queryFn: () => fetchUser(user),
  });
  return {
    user: data,
    isLoading: false,
    isError: error,
  };
}
