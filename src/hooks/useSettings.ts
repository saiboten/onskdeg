// wishRef =

import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Settings } from "../types/types";

const fetcher = async (
  collection: "settings",
  uid: string
): Promise<Settings | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection(collection)
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            darkMode: true,
            ...doc.data(),
          });
        } else {
          resolve({
            darkMode: true,
          });
        }
      });
  });
};

export function useSettings(uid: string, useSuspense: boolean) {
  const { data, error } = useSWR(["settings", uid], fetcher, {
    suspense: useSuspense,
  });
  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
  };
}
