import React, { useState } from "react";
import Container from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import { StyledLabel } from "../common/Label";
import { Button } from "../common/Button";
import firebase from "../firebase/firebase";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";

interface Invite {
  name: string;
  email: string;
}

export const AddGroup: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);

  const { loggedInUser } = useLoggedInUser();

  function handleAddGroup() {
    var db = firebase.firestore();
    db.collection("groups").add({
      invites,
      admin: loggedInUser?.uid,
      groupName,
    });
  }

  return (
    <Container textLeft>
      <StyledLabel>Navn på gruppe</StyledLabel>
      <StyledInput
        id="groupName"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></StyledInput>

      <h1>Legg til bruker</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setName("");
          setEmail("");
          setInvites([...invites, { name, email }]);
        }}
      >
        <StyledLabel htmlFor="name">Navn</StyledLabel>
        <StyledInput
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></StyledInput>
        <StyledLabel htmlFor="email">Epost</StyledLabel>
        <StyledInput
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></StyledInput>
        <Button type="submit">Legg til</Button>
      </form>

      <div>Inviterte brukere:</div>
      {invites.map((user: Invite) => {
        return (
          <div>
            {user.name} - {user.email}
          </div>
        );
      })}
      <Button onClick={handleAddGroup}>Lagre gruppe</Button>
    </Container>
  );
};
