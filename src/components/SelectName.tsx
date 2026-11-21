import { useEffect, useState } from "react";
import { Button } from "./common/Button";
import { Container } from "./common/Container";
import { StyledLabel } from "./common/Label";
import { StyledInput } from "./common/StyledInput";
import { StyledLabelInputPair } from "./common/StyledLabelInputPair";
import firebase from "./firebase/firebase";
import { invalidate } from "../queryClient";
import { PageHeader, Panel } from "./common/Page";

interface Props {
  firebaseUser?: firebase.User;
  uid: string;
}

export const SelectName = ({ firebaseUser, uid }: Props) => {
  const [name, setName] = useState(firebaseUser?.displayName || "");

  useEffect(() => {
    setName(firebaseUser?.displayName || "");
  }, [firebaseUser?.displayName]);

  async function handleSetName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await firebase.firestore().collection("user").doc(uid).update({
      name,
    });
    invalidate(["user", uid]);
  }

  return (
    <Container className="max-w-520">
      <PageHeader
        title="Velkommen! 👋"
        subtitle="Hva heter du? Navnet vises for de andre i gruppene dine."
      />

      <Panel>
        <form onSubmit={handleSetName}>
          <StyledLabel htmlFor="name">Navn</StyledLabel>
          <StyledLabelInputPair>
            <StyledInput
              autoComplete="off"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></StyledInput>
            <Button type="submit" disabled={!name.trim()}>
              Fortsett
            </Button>
          </StyledLabelInputPair>
        </form>
      </Panel>
    </Container>
  );
};
