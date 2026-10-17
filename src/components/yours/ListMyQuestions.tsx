import React, { useState } from "react";
import { mutate } from "swr";
import { useUser } from "../../hooks/useUser";
import { Notification, Question as QuestionType } from "../../types/types";
import { Button } from "../common/Button";
import Loading from "../common/Loading";
import { Spacer } from "../common/Spacer";
import { StyledSubHeader } from "../common/StyledHeading";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { useNotification } from "../common/StyledNotification";
import firebase from "../firebase/firebase";

interface Props {
  questions: QuestionType[] | undefined;
  myUid: string;
  wishId: string;
}

interface QuestionProps {
  question: QuestionType;
  wishId: string;
  myUid: string;
}

const Question = ({ myUid, question, wishId }: QuestionProps) => {
  const [answer, setAnswer] = useState("");
  const { element, flash } = useNotification("Spørsmål lagt til");
  const { user } = useUser(myUid);
  const [loading, setLoading] = useState(false);

  async function handleSaveQuestion(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    await firebase
      .firestore()
      .collection("question")
      .doc(question.questionId)
      .update({
        answer,
      });

    const notification: Notification = {
      link: `/other/${myUid}/${question.wishId}`,
      completed: false,
      id: "",
      message: `${user?.name} har svart på spørsmålet ditt. Klikk her for å lese svaret.`,
      to: question.questionOwner,
    };

    const ref = await firebase
      .firestore()
      .collection("notifications")
      .add(notification);
    await ref.update({
      id: ref.id,
    });

    flash();
    mutate(["question", wishId]);
    setLoading(false);
  }

  return (
    <>
      <div className="relative inline-block rounded-[1rem] bg-white p-15 text-black not-last:mr-10 not-last:mb-10">
        {question.question}
        {question.answer ? (
          <div>Svar: {question.answer}</div>
        ) : (
          <form onSubmit={handleSaveQuestion}>
            <StyledLabelInputPair>
              <input
                className="mx-8 h-48 w-[calc(100%-1.6rem)] flex-1 rounded-[10px] border border-solid border-black pr-10 pl-40 text-[1.6rem] placeholder:text-[1.6rem]"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></input>
              {loading ? <Loading /> : <Button>Svar</Button>}
            </StyledLabelInputPair>
          </form>
        )}
      </div>
      <Spacer />
      {element}
    </>
  );
};

export const ListMyQuestions = ({ myUid, wishId, questions }: Props) => {
  return (
    <div>
      <StyledSubHeader>Spørsmål og svar</StyledSubHeader>
      <div className="flex flex-wrap">
        {questions?.map((el) => {
          return (
            <Question
              key={el.questionId}
              myUid={myUid}
              wishId={wishId}
              question={el}
            />
          );
        })}
      </div>
      <Spacer />
    </div>
  );
};
