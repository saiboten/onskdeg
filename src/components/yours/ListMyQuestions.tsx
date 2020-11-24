import React, { useState } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import { useUser } from "../../hooks/useUser";
import { Notification, Question as QuestionType } from "../../types/types";
import { Button } from "../common/Button";
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

const StyledQuestionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDeleteButton = styled.button`
  background: none;
  position: absolute;
  top: 0;
  right: 0;
  height: 2rem;
  width: 2rem;
  outline: none;
  border: none;
  cursor: pointer;
`;

const StyledQuestion = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  color: black;
  display: inline-block;
  &:not(:last-child) {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`;

export const StyledInput = styled.input`
  height: 48px;
  padding: 0 10px;
  padding-left: 40px;
  width: calc(100% - 1.6rem);
  margin: 0 0.8rem;
  border-radius: 10px;
  border: none;
  font-size: 1.6rem;
  flex: 1;
  border: 1px solid black;

  &::placeholder {
    font-size: 1.6rem;
  }
`;

interface QuestionProps {
  question: QuestionType;
  wishId: string;
  myUid: string;
}

const Question = ({ myUid, question, wishId }: QuestionProps) => {
  const [answer, setAnswer] = useState("");
  const { element, flash } = useNotification("Spørsmål slettet");
  const { user } = useUser(myUid);

  async function handleSaveQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await firebase
      .firestore()
      .collection("question")
      .doc(question.questionId)
      .update({
        answer,
      });

    // TODO send notification
    const notification: Notification = {
      link: `/other/${question.questionOwner}/${question.wishId}`,
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
  }

  return (
    <>
      <StyledQuestion>
        {question.question}
        {question.answer ? (
          <div>Svar: {question.answer}</div>
        ) : (
          <form onSubmit={handleSaveQuestion}>
            <StyledLabelInputPair>
              <StyledInput
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></StyledInput>
              <Button>Svar</Button>
            </StyledLabelInputPair>
          </form>
        )}
      </StyledQuestion>
      <Spacer />
      {element}
    </>
  );
};

export const ListMyQuestions = ({ myUid, wishId, questions }: Props) => {
  return (
    <div>
      <StyledSubHeader>Spørsmål og svar</StyledSubHeader>
      <StyledQuestionWrapper>
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
      </StyledQuestionWrapper>
      <Spacer />
    </div>
  );
};
