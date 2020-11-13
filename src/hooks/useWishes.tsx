import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Wish } from "../types/types";

const fetcher = async (
  wishes: "wishes",
  userId: string
): Promise<Wish[] | undefined> => {
  return await new Promise(async (resolve) => {
    if (userId === "") {
      resolve([]);
      return;
    }

    const docRef = firebase.firestore().collection(wishes).doc(userId);

    const doc = await docRef.get();

    if (doc.exists) {
      resolve([...doc.data()?.wishes]);
    } else {
      await docRef.set({
        wishes: [],
      });
      resolve([]);
    }
  });
};

export function useWishes(user: string) {
  const { data, error } = useSWR(["wishes", user], fetcher, { suspense: true });

  return {
    wishes: data,
    isLoading: !error && !data,
    isError: error,
  };
}
