import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { User } from "../types/types";

const fetcher = async (collection: "user", userId: string): Promise<User> => {
  return await new Promise(async (resolve) => {
    if (userId === "") {
      resolve({
        uid: "",
        groups: [],
        isChild: false,
      });
      return;
    }

    const userDoc = firebase.firestore().collection(collection).doc(userId);

    const userData = await userDoc.get();

    if (userData.exists) {
      const user = {
        uid: "",
        childs: [],
        groups: [],
        isChild: false,
        ...userData.data(),
      };
      resolve(user);
    } else {
      await userDoc.set({
        uid: userId,
        childs: [],
        groups: [],
        isChild: false,
      });
      resolve({
        uid: userId,
        childs: [],
        groups: [],
        isChild: false,
      });
    }
  });
};

export function useUser(user: string) {
  const { data, error } = useSWR(["user", user], fetcher, { suspense: true });
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
