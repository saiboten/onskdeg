import { useState } from "react";
import { redirect } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { BorderButton } from "../common/Button";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Child } from "../../types/types";
import { Spacer } from "../common/Spacer";
import Spinner from "../common/Spinner";

interface Props {
  uid: string;
}

export function AddChild({ uid }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser(uid);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const newChildDoc = firebase.firestore().collection("user").doc();

    const newChild: Child = {
      name,
      parent: [user?.uid || ""],
      uid: newChildDoc.id,
      isChild: true,
      groups: [...(user?.groups ?? [])],
    };

    await newChildDoc.set(newChild);

    await firebase
      .firestore()
      .collection("user")
      .doc(user?.uid || "")
      .update({
        childs: [...(user?.childs ?? []), newChildDoc.id],
      });

    user?.groups.forEach(async (group) => {
      const groupData = await firebase
        .firestore()
        .collection("groups")
        .doc(group)
        .get();

      await firebase
        .firestore()
        .collection("groups")
        .doc(group)
        .update({
          members: [...(groupData.data()?.members ?? []), newChildDoc.id],
        });
    });

    invalidate(["user", uid]);
    redirect("/");
  }

  return (
    <Container textLeft>
      <h1>Legg til ekstra bruker</h1>
      <Spacer />
      <p>
        Har du barn som du ønsker å legge inn ønsker for, eller ønsker en felles
        ønskeliste for deg og din bedre halvdel? Opprett en ekstra bruker da
        vel! Du kan dele brukeren etter opprettelse.
      </p>
      <Spacer />
      <form
        className="flex flex-col items-start justify-center text-left text-[3rem]"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-10 [&_button]:mb-0">
          <StyledInput
            type="text"
            placeholder="Navn"
            autoComplete={"off"}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {submitting ? (
            <Spinner />
          ) : (
            <BorderButton type="submit">OK</BorderButton>
          )}
        </div>
      </form>
    </Container>
  );
}
