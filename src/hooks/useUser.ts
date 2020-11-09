// wishRef =

import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (userId: string): Promise<User | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("user")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            ...doc.data(),
          } as User);
        } else {
          resolve();
        }
      });
  });
};

export function useUser(user: string | undefined) {
  const { data, error } = useSWR(`/user/${user}`, fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
