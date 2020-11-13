import { Suspense } from "react";
import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (
  collectionId: string,
  groupId: string
): Promise<User | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("groups")
      .doc(groupId)
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

export function useKohort(groupId: string) {
  const { data, error } = useSWR(["groups", groupId], fetcher, {
    suspense: true,
  });
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
