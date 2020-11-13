import React, { useState } from "react";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import { StyledLabel } from "../common/Label";
import { Button } from "../common/Button";
import firebase from "../firebase/firebase";
import { useUser } from "../../hooks/userUser";
import styled from "styled-components";
import { Spacer } from "../common/Spacer";
import { Redirect } from "react-router";

interface Invite {
  email: string;
}

interface Props {
  uid: string;
}

const StyledLabelInput = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledUl = styled.ul`
  padding-left: 20px;
`;

export const AddKohort: React.FC<Props> = ({ uid }) => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [groupCreated, setGroupCreated] = useState(false);

  const { user } = useUser(uid);

  async function handleAddGroup() {
    var db = firebase.firestore();
    var docRef = await db.collection("groups").add({
      invites,
      admin: user?.uid,
      groupName,
      members: [user?.uid],
    });

    invites.forEach(async (invite) => {
      const doc = db.collection("invites").doc(invite.email);
      var docDetails = await doc.get();

      doc.set({
        myInvites: [...(docDetails.data()?.myInvites || []), docRef.id],
      });
    });

    setGroupCreated(true);
  }

  if (groupCreated) {
    return <Redirect to="/others?groupCreated=true" />;
  }

  return (
    <Container textLeft>
      <h1>Opprett kohort</h1>
      <StyledLabel>Navn på kohort</StyledLabel>
      <StyledInput
        autoComplete="off"
        id="groupName"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></StyledInput>
      <Spacer />
      <h2>Legg til kohortmedlem</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEmail("");
          setInvites([...invites, { email }]);
        }}
      >
        <StyledLabel htmlFor="email">Epost</StyledLabel>
        <StyledLabelInput>
          <StyledInput
            autoComplete="off"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></StyledInput>
          <Button type="submit">Legg til</Button>
        </StyledLabelInput>
      </form>
      <Spacer />
      <div>Inviterte brukere:</div>

      {invites.length > 0 ? (
        <StyledUl>
          {invites.map((user: Invite) => {
            return <li>{user.email}</li>;
          })}
        </StyledUl>
      ) : (
        <div>Ingen brukere lagt til</div>
      )}
      <Spacer />
      <Button onClick={handleAddGroup}>Lagre gruppe</Button>
    </Container>
  );
};
