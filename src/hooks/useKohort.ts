import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Kohort } from "../types/types";

const emptyKohort: Kohort = {
  id: "",
  groupName: "",
  admin: "",
  members: [],
  invites: [],
};

async function fetchKohort(groupId: string): Promise<Kohort> {
  if (groupId === undefined || groupId === "") {
    return emptyKohort;
  }

  const doc = await firebase
    .firestore()
    .collection("groups")
    .doc(groupId)
    .get();

  return {
    ...emptyKohort,
    ...doc.data(),
  };
}

export function useKohort(groupId: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["groups", groupId],
    queryFn: () => fetchKohort(groupId),
  });
  return {
    kohort: data,
    isLoading: false,
    isError: error,
  };
}
