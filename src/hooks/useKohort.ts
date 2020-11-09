import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (userId: string): Promise<User | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("kohort")
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

export function useKohort(kohortId: string) {
  const { data, error } = useSWR(`/kohort/${kohortId}`, fetcher);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
