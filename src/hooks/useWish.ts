import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Wish } from "../types/types";

const fetcher = async (wishId: string): Promise<Wish> => {
  return await new Promise((resolve) => {
    firebase
      .firestore()
      .collection("wish")
      .doc(wishId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            ...doc.data(),
          } as Wish);
        } else {
          resolve({} as Wish);
        }
      });
  });
};

export function useWish(wishId: string) {
  const { data, error } = useSWR(`/wish/${wishId}`, fetcher);
  return {
    wish: data,
    isLoading: !error && !data,
    isError: error,
  };
}
