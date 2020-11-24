import React, { useState } from "react";
import { mutate } from "swr";
import { useUser } from "../../hooks/useUser";
import { useWish } from "../../hooks/useWish";
import { Notification, Question } from "../../types/types";
import { Button } from "../common/Button";
import Loading from "../common/Loading";
import { StyledSubHeader } from "../common/StyledHeading";
import { StyledInput } from "../common/StyledInput";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { useNotification } from "../common/StyledNotification";
import firebase from "../firebase/firebase";

interface Props {
  wishId: string;
  wishOwnerUid: string;
  myUid: string;
}

export const AddQuestion = ({ myUid, wishOwnerUid, wishId }: Props) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser(wishOwnerUid);
  const { wish } = useWish(wishOwnerUid, wishId);
  const { flash, element } = useNotification("Spørsmål stilt");

  async function handleAddQuestion(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const questionObject: Question = {
      wishId: wishId,
      question: question,
      questionOwner: myUid,
      questionId: "",
    };

    var doc = await firebase
      .firestore()
      .collection("question")
      .add(questionObject);

    await firebase.firestore().collection("question").doc(doc.id).update({
      questionId: doc.id,
    });

    const notification: Notification = {
      id: "",
      message: `Noen har stilt deg et spørsmål om ditt ønske ${wish?.name}. Gå til ønsket.`,
      link: `/wish/${wishOwnerUid}/${wishId}`,
      to: wishOwnerUid,
      completed: false,
    };

    const ref = await firebase
      .firestore()
      .collection("notifications")
      .add(notification);

    await ref.update({
      id: ref.id,
    });

    if (user?.email) {
      try {
        const sendInvite = firebase
          .functions()
          .httpsCallable("sendNotification");
        const result = await sendInvite({
          toEmail: user?.email,
          wishName: wish?.name || "Ukjent",
        });
        console.log(result);
      } catch (e) {
        // Email fails on localhost
        console.log(e);
      }
    }

    setQuestion("");
    flash();
    mutate(["question", wishId]);
    setLoading(false);
  }

  return (
    <div>
      <StyledSubHeader>Still spørsmål</StyledSubHeader>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleAddQuestion}>
          <StyledLabelInputPair>
            <StyledInput
              placeholder="Legg til spørsmål her"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></StyledInput>
            <Button type="submit">Legg til</Button>
          </StyledLabelInputPair>
        </form>
      )}
      {element}
    </div>
  );
};
