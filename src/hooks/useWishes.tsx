import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Wish } from "../types/types";

async function fetchWishes(userId: string): Promise<Wish[]> {
  if (userId === "") {
    return [];
  }

  const query = await firebase
    .firestore()
    .collection("wish")
    .where("owner", "==", userId)
    .orderBy("date", "asc")
    .get();

  const wishes: Wish[] = query.docs.map((doc) => ({
    owner: "",
    deleted: false,
    description: "",
    id: "",
    isSuggestion: false,
    link: "",
    name: "",
    ...doc.data(),
  }));

  return wishes.reverse();
}

export function useWishes(user: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["wish", user],
    queryFn: () => fetchWishes(user),
  });

  return {
    wishes: data,
    isLoading: false,
    isError: error,
  };
}
