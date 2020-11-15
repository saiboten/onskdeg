import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Invites } from "../types/types";

const fetcher = async (
  collection: "invites",
  email: string
): Promise<Invites> => {
  return await new Promise((resolve) => {
    if (email === "") {
      resolve({
        myInvites: [],
      });
      return;
    }

    firebase
      .firestore()
      .collection(collection)
      .doc(email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const user = {
            myInvites: [],
            ...doc.data(),
          };
          resolve(user);
        } else {
          resolve({
            myInvites: [],
          });
        }
      });
  });
};

export function useInvites(email: string) {
  const { data, error } = useSWR(["invites", email], fetcher, {
    suspense: true,
  });
  return {
    invites: data,
    isLoading: !error && !data,
    isError: error,
  };
}
