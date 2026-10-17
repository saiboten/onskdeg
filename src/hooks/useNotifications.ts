import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Notification } from "../types/types";

async function fetchNotifications(uid: string): Promise<Notification[]> {
  const docs = await firebase
    .firestore()
    .collection("notifications")
    .where("to", "==", uid)
    .get();

  return docs.docs.map((el) => ({
    id: "",
    completed: false,
    link: "",
    message: "",
    to: "",
    ...el.data(),
  }));
}

export function useNotifications(uid: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["notifications", uid],
    queryFn: () => fetchNotifications(uid),
  });
  return {
    notifications: data,
    isLoading: false,
    isError: error,
  };
}
