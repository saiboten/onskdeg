import React, { useState } from "react";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import { StyledLabel } from "../common/Label";
import { Button } from "../common/Button";
import firebase from "../firebase/firebase";
import { useUser } from "../../hooks/useUser";
import { Spacer } from "../common/Spacer";
import { redirect } from "react-router-dom";
import { StyledBigHeader } from "../common/StyledHeading";

interface Props {
  uid: string;
}

export const AddKohort: React.FC<Props> = ({ uid }) => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);

  const { user } = useUser(uid);

  async function handleAddGroup() {
    const db = firebase.firestore();

    const docRef = await db.collection("groups").add({
      invites,
      admin: user?.uid,
      groupName,
      members: [user?.uid, ...(user?.childs ?? [])],
    });

    await docRef.update({
      id: docRef.id,
    });

    // Add current user to kohort
    await db
      .collection("user")
      .doc(user?.uid)
      .update({
        groups: [...(user?.groups ?? []), docRef.id],
      });

    // Add current users children to kohort as default
    user?.childs?.forEach(async (child) => {
      const childData = await db.collection("user").doc(child).get();

      await db
        .collection("user")
        .doc(child)
        .update({
          groups: [...(childData.data()?.groups ?? []), docRef.id],
        });
    });

    // Add all invites to invites collection
    invites.forEach(async (invite) => {
      const doc = db.collection("invites").doc(invite);
      var docDetails = await doc.get();

      doc.set({
        myInvites: [...(docDetails.data()?.myInvites ?? []), docRef.id],
      });
    });

    redirect("/others?groupCreated=true");
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Opprett gruppe</StyledBigHeader>
      <StyledLabel>Navn på gruppe</StyledLabel>
      <StyledInput
        autoComplete="off"
        id="groupName"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></StyledInput>
      <Spacer />
      <h2>Legg til gruppemedlem</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEmail("");
          setInvites([email.toLowerCase(), ...invites]);
        }}
      >
        <StyledLabel htmlFor="email">Epost</StyledLabel>
        <div className="flex justify-between">
          <StyledInput
            autoComplete="off"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></StyledInput>
          <Button type="submit">Legg til</Button>
        </div>
      </form>
      <Spacer />
      <div>Inviterte brukere:</div>

      {invites.length > 0 ? (
        <ul className="pl-20">
          {invites.map((email: string) => {
            return <li key={email}>{email}</li>;
          })}
        </ul>
      ) : (
        <div>Ingen brukere lagt til</div>
      )}
      <Spacer />
      <Button onClick={handleAddGroup}>Lagre gruppe</Button>
    </Container>
  );
};
