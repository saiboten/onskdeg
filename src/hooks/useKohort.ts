import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Kohort } from "../types/types";

const fetcher = async ([groups, groupId]: [string, string]): Promise<Kohort> => {
  return await new Promise((resolve) => {
    if (groupId === undefined || groupId === "") {
      return {};
    }

    firebase
      .firestore()
      .collection(groups)
      .doc(groupId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            id: "",
            groupName: "",
            admin: "",
            members: [],
            invites: [],
            ...doc.data(),
          });
        } else {
          resolve({
            id: "",
            admin: "",
            members: [],
            invites: [],
            groupName: "",
          });
        }
      });
  });
};

export function useKohort(groupId: string) {
  const { data, error } = useSWR(["groups", groupId], fetcher, {
    suspense: true,
  });
  return {
    kohort: data,
    isLoading: !error && !data,
    isError: error,
  };
}
