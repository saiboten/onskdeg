import React from "react";
import styled from "styled-components";
import { mutate } from "swr";
import { StringLiteral } from "typescript";
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
      <StyledQuestionWrapper>
        {questions?.map((el) => {
          return (
            <React.Fragment key={el.question}>
              <StyledQuestion>
                {el.question}
                {el.answer && <div>Svar: {el.answer}</div>}
                {el.questionOwner === myUid && (
                  <StyledDeleteButton
                    onClick={() => handleDeleteQuestion(el.questionId)}
                  >
                    X
                  </StyledDeleteButton>
                )}
              </StyledQuestion>
              <Spacer />
            </React.Fragment>
          );
        })}
      </StyledQuestionWrapper>
      <Spacer />
      {element}
    </div>
  );
};
