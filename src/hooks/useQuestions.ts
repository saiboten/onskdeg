import useSWR from "swr";
import firebase from "../components/firebase/firebase";
import { Question } from "../types/types";

const fetcher = async (
  [question, wishId]: [string, string]
): Promise<Question[] | undefined> => {
  const refs = firebase
    .firestore()
    .collection(question)
    .where("wishId", "==", wishId);

  const docs = await refs.get();

  console.log(docs.size);

  const bla: Question[] = docs.docs.map((el) => ({
    wishId: wishId,
    question: "",
    questionOwner: "",
    questionId: "",
    ...el.data(),
  }));
  return bla;
};

export function useQuestions(wishId: string) {
  const { data, error } = useSWR(["question", wishId], fetcher, {
    suspense: true,
  });
  return {
    questions: data,
    isLoading: !error && !data,
    isError: error,
  };
}
