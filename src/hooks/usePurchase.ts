import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Purchase } from "../types/types";

async function fetchPurchase(purchaseId: string): Promise<Purchase> {
  const doc = await firebase
    .firestore()
    .collection("purchase")
    .doc(purchaseId)
    .get();

  if (doc.exists) {
    return {
      checked: false,
      checkedBy: undefined,
      ...doc.data(),
    };
  }
  return {
    checked: false,
  };
}

export function usePurchase(purchaseId: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["purchase", purchaseId],
    queryFn: () => fetchPurchase(purchaseId),
  });
  return {
    purchase: data,
    isLoading: false,
    isError: error,
  };
}
