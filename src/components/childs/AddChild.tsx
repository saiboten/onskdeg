import { useState } from "react";
import { redirect } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import { BorderButton } from "../common/Button";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import { Child } from "../../types/types";
import { Spacer } from "../common/Spacer";
import Spinner from "../common/Spinner";

const StyledForm = styled.form`
  display: flex;
  text-align: left;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 3rem;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

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

    mutate(["user", uid]);
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
      <StyledForm onSubmit={handleSubmit}>
        <StyledRow>
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
        </StyledRow>
      </StyledForm>
    </Container>
  );
}
