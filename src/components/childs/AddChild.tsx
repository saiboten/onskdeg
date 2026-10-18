import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Button } from "../common/Button";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { StyledBigHeader } from "../common/StyledHeading";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Child } from "../../types/types";
import Spinner from "../common/Spinner";

interface Props {
  uid: string;
}

export function AddChild({ uid }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser(uid);
  const navigate = useNavigate();

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
    navigate("/");
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Legg til ekstra bruker</StyledBigHeader>
      <p className="mb-20">
        Har du barn som du ønsker å legge inn ønsker for, eller ønsker en felles
        ønskeliste for deg og din bedre halvdel? Opprett en ekstra bruker da
        vel! Du kan dele brukeren etter opprettelse.
      </p>
      <form onSubmit={handleSubmit}>
        <StyledLabelInputPair className="max-w-500">
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
            <Button type="submit" disabled={!name.trim()}>
              Opprett
            </Button>
          )}
        </StyledLabelInputPair>
      </form>
    </Container>
  );
}
