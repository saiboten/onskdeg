import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Wish } from "../types/types";

const fetcher = async (wishes: "wish", userId: string): Promise<Wish[]> => {
  return await new Promise(async (resolve) => {
    if (userId === "") {
      resolve([]);
      return;
    }

    const queryRef = firebase
      .firestore()
      .collection(wishes)
      .where("owner", "==", userId)
      .orderBy("date", "asc");

    const query = await queryRef.get();

    if (!query.empty) {
      console.log("query not empty");
      const wishRes: Wish[] = query.docs.map((doc) => {
        const wish: Wish = {
          owner: "",
          deleted: false,
          description: "",
          id: "",
          isSuggestion: false,
          link: "",
          name: "",
          ...doc.data(),
        };

        return wish;
      });

      resolve(wishRes.reverse());
    } else {
      console.log("query ... empty?");
      resolve([]);
    }
  });
};

export function useWishes(user: string) {
  const { data, error } = useSWR(["wish", user], fetcher, {
    suspense: true,
  });

  return {
    wishes: data,
    isLoading: !error && !data,
    isError: error,
  };
}
