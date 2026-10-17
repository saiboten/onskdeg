import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Invites } from "../types/types";

async function fetchInvites(email: string): Promise<Invites> {
  if (email === "") {
    return {
      myInvites: [],
    };
  }

  const doc = await firebase.firestore().collection("invites").doc(email).get();

  return {
    myInvites: [],
    ...doc.data(),
  };
}

export function useInvites(email: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["invites", email],
    queryFn: () => fetchInvites(email),
  });
  return {
    invites: data,
    isLoading: false,
    isError: error,
  };
}
