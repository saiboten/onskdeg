import React, { useState } from "react";
import { Redirect } from "react-router";
import styled from "styled-components";
import { useUser } from "../../hooks/userUser";
import { BorderButton } from "../common/Button";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import { Child } from "../../types/types";

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

export function Guardians({ uid }: Props) {
  const [name, setName] = useState("");
  const [created, setCreated] = useState(false);
  const { user } = useUser(uid);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newChildDoc = firebase.firestore().collection("user").doc();

    const newChild: Child = {
      name,
      parent: [user?.uid || ""],
      uid: newChildDoc.id,
    };

    await newChildDoc.set(newChild);

    await firebase
      .firestore()
      .collection("user")
      .doc(user?.uid || "")
      .update({
        childs: [...(user?.childs || []), newChildDoc.id],
      });

    setCreated(true);
    mutate(["user", uid]);
  }

  if (created) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <h1>Legg til barn</h1>
      <StyledForm onSubmit={handleSubmit}>
        <StyledRow>
          <StyledInput
            type="text"
            placeholder="Barnets navn"
            autoComplete={"off"}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <BorderButton type="submit">OK</BorderButton>
        </StyledRow>
      </StyledForm>
    </Container>
  );
}
