// wishRef =

import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Purchase } from "../types/types";

const fetcher = async (
  [_, purchaseId]: [string, string]
): Promise<Purchase | undefined> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("purchase")
      .doc(purchaseId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            checked: false,
            checkedBy: undefined,
            ...doc.data(),
          });
        } else {
          resolve({
            checked: false,
          });
        }
      });
  });
};

export function usePurchase(purchaseId: string) {
  const { data, error } = useSWR(["purchase", purchaseId], fetcher, {
    suspense: true,
  });
  return {
    purchase: data,
    isLoading: !error && !data,
    isError: error,
  };
}
