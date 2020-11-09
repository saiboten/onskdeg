import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (): Promise<User> => {
  return await new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase
        .firestore()
        .collection("user")
        .doc(user?.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("user exist. Should resolve promise");
            resolve({
              ...doc.data(),
            } as User);
          } else {
            console.log("Resolve without anything??");
            resolve({} as User);
          }
        });
    });
  });
};

export function useLoggedInUser() {
  const { data, error } = useSWR(`/user`, fetcher);
  return {
    loggedInUser: data,
    isLoading: !error && !data,
    isError: error,
  };
}
