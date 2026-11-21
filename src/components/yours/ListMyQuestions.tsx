import React, { useState } from "react";
import { invalidate } from "../../queryClient";
import { useUser } from "../../hooks/useUser";
import { Notification, Question as QuestionType } from "../../types/types";
import { Button } from "../common/Button";
import Spinner from "../common/Spinner";
import { Section } from "../common/Page";
import { MessageCircleQuestion } from "lucide-react";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { StyledInput } from "../common/StyledInput";
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
    invalidate(["question", wishId]);
    setLoading(false);
  }

  return (
    <div className="rounded-[12px] bg-primary px-16 py-12 text-text">
      <p className="flex items-start gap-8 font-semibold">
        <MessageCircleQuestion size={18} className="mt-3 shrink-0 opacity-70" />
        {question.question}
      </p>
      {question.answer ? (
        <p className="mt-4 pl-26 opacity-85">{question.answer}</p>
      ) : (
        <form className="mt-8" onSubmit={handleSaveQuestion}>
          <StyledLabelInputPair>
            <StyledInput
              placeholder="Skriv et svar"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {loading ? (
              <Spinner />
            ) : (
              <Button type="submit" disabled={!answer.trim()}>
                Svar
              </Button>
            )}
          </StyledLabelInputPair>
        </form>
      )}
      {element}
    </div>
  );
};

export const ListMyQuestions = ({ myUid, wishId, questions }: Props) => {
  if (!questions?.length) {
    return null;
  }

  return (
    <Section
      title="Spørsmål fra andre"
      description="Svarene dine vises for den som spurte."
    >
      <div className="flex flex-col gap-8">
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
    </Section>
  );
};
