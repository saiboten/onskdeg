// wishRef =

import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Purchase } from "../types/types";

const fetcher = async (userId: string): Promise<Purchase | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("purchase")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            ...doc.data(),
          } as Purchase);
        } else {
          resolve();
        }
      });
  });
};

export function usePurchase(purchaseId: string) {
  const { data, error } = useSWR(`/purchase/${purchaseId}`, fetcher);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
