import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { Question } from "../types/types";

async function fetchQuestions(wishId: string): Promise<Question[]> {
  const docs = await firebase
    .firestore()
    .collection("question")
    .where("wishId", "==", wishId)
    .get();

  return docs.docs.map((el) => ({
    wishId: wishId,
    question: "",
    questionOwner: "",
    questionId: "",
    ...el.data(),
  }));
}

export function useQuestions(wishId: string) {
  const { data, error } = useSuspenseQuery({
    queryKey: ["question", wishId],
    queryFn: () => fetchQuestions(wishId),
  });
  return {
    questions: data,
    isLoading: false,
    isError: error,
  };
}
