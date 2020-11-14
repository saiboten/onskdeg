import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (collection: "user", userId: string): Promise<User> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection(collection)
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const user = {
            uid: "",
            childs: [],
            groups: [],
            isChild: false,
            ...doc.data(),
          };
          resolve(user);
        } else {
          resolve();
        }
      });
  });
};

export function useUser(user: string) {
  const { data, error } = useSWR(["user", user], fetcher, { suspense: true });
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
