import React, { useState } from "react";
import { Button } from "./common/Button";
import { Container } from "./common/Container";
import { StyledLabel } from "./common/Label";
import { StyledInput } from "./common/StyledInput";
import styled from "styled-components";
import { useUser } from "../hooks/useUser";
import firebase from "./firebase/firebase";
import { mutate } from "swr";
import { StyledBigHeader } from "./common/StyledHeading";

const StyledLabelInput = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  firebaseUser?: firebase.User;
  uid: string;
}

export const SelectName = ({ firebaseUser, uid }: Props) => {
  const [name, setName] = useState(firebaseUser?.displayName || "");

  async function handleSetName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await firebase.firestore().collection("user").doc(uid).update({
      name,
    });
    mutate(["user", uid]);
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Navn</StyledBigHeader>
      <p>Hei, hva heter du?</p>

      <form onSubmit={handleSetName}>
        <StyledLabel htmlFor="name">Navn</StyledLabel>
        <StyledLabelInput>
          <StyledInput
            autoComplete="off"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></StyledInput>
          <Button type="submit">Legg til</Button>
        </StyledLabelInput>
      </form>
    </Container>
  );
};
