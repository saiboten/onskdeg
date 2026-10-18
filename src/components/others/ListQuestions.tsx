import { invalidate } from "../../queryClient";
import { Question } from "../../types/types";
import { X } from "lucide-react";
import { IconButton } from "../common/Button";
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
    invalidate(["question", wishId]);
  }

  if (!questions?.length) {
    return null;
  }

  return (
    <div className="mb-24">
      <StyledSubHeader>Spørsmål og svar</StyledSubHeader>
      <div className="flex flex-col gap-10">
        {questions.map((el) => (
          <div
            key={el.questionId}
            className="flex items-start gap-8 rounded-[10px] bg-primary py-12 pr-8 pl-16 text-text"
          >
            <div className="min-w-0 flex-1 wrap-break-word">
              <p className="font-semibold">{el.question}</p>
              <p className={el.answer ? "" : "opacity-60"}>
                {el.answer ? `Svar: ${el.answer}` : "Ikke besvart enda"}
              </p>
            </div>
            {el.questionOwner === myUid && (
              <IconButton
                className="h-28 w-28"
                aria-label="Slett spørsmål"
                onClick={() => handleDeleteQuestion(el.questionId)}
              >
                <X size={18} />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      {element}
    </div>
  );
};
