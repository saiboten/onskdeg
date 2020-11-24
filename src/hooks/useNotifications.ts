import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Notification } from "../types/types";

const fetcher = async (
  collection: "notifications",
  uid: string
): Promise<Notification[] | undefined> => {
  const refs = firebase
    .firestore()
    .collection(collection)
    .where("to", "==", uid);

  const docs = await refs.get();

  const notifications: Notification[] = docs.docs.map((el) => ({
    id: "",
    completed: false,
    link: "",
    message: "",
    to: "",
    ...el.data(),
  }));
  return notifications;
};

export function useNotifications(uid: string) {
  const { data, error } = useSWR(["notifications", uid], fetcher, {
    suspense: true,
  });
  return {
    notifications: data,
    isLoading: !error && !data,
    isError: error,
  };
}
