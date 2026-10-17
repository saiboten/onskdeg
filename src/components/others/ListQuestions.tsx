import React from "react";
import { mutate } from "swr";
import { Question } from "../../types/types";
import { Spacer } from "../common/Spacer";
import { StyledSubHeader } from "../common/StyledHeading";
import { useNotification } from "../common/StyledNotification";
import firebase from "../firebase/firebase";

interface Props {
  questions: Question[] | undefined;
  myUid: string;
  wishId: string;
}

export const ListQuestions = ({ myUid, wishId, questions }: Props) => {
  const { element, flash } = useNotification("Spørsmål slettet");

  async function handleDeleteQuestion(questionId: string) {
    await firebase.firestore().collection("question").doc(questionId).delete();
    flash();
    mutate(["question", wishId]);
  }

  return (
    <div>
      <StyledSubHeader>Spørsmål og svar</StyledSubHeader>
      <div className="flex flex-wrap">
        {questions?.map((el) => {
          return (
            <React.Fragment key={el.question}>
              <div className="relative inline-block rounded-[1rem] bg-white p-15 text-black not-last:mr-10 not-last:mb-10">
                {el.question}
                {el.answer && <div>Svar: {el.answer}</div>}
                {el.questionOwner === myUid && (
                  <button
                    className="absolute top-0 right-0 h-20 w-20 cursor-pointer border-none bg-transparent outline-none"
                    onClick={() => handleDeleteQuestion(el.questionId)}
                  >
                    X
                  </button>
                )}
              </div>
              <Spacer />
            </React.Fragment>
          );
        })}
      </div>
      <Spacer />
      {element}
    </div>
  );
};
