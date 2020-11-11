import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Wish } from "../types/types";

const fetcher = async (
  wishes: "wishes",
  userId: string
): Promise<Wish[] | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection(wishes)
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve([...doc.data()?.wishes]);
        } else {
          resolve();
        }
      });
  });
};

export function useWishes(user: string) {
  const { data, error } = useSWR(["wishes", user], fetcher);
  return {
    wishes: data,
    isLoading: !error && !data,
    isError: error,
  };
}
