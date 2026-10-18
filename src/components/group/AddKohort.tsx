import React, { useState } from "react";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import { StyledLabel } from "../common/Label";
import { Button } from "../common/Button";
import firebase from "../firebase/firebase";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { invalidate } from "../../queryClient";

interface Props {
  uid: string;
}

export const AddKohort: React.FC<Props> = ({ uid }) => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);

  const { user } = useUser(uid);
  const navigate = useNavigate();

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

    invalidate(["user", uid]);
    navigate(`/others?group=${docRef.id}`);
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Opprett gruppe</StyledBigHeader>
      <StyledLabel htmlFor="groupName">Navn på gruppe</StyledLabel>
      <StyledInput
        autoComplete="off"
        id="groupName"
        placeholder="F.eks. Familien"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></StyledInput>

      <StyledSubHeader className="mt-32">
        Inviter gruppemedlemmer
      </StyledSubHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          setEmail("");
          setInvites([email.toLowerCase(), ...invites]);
        }}
      >
        <StyledLabel htmlFor="email">Epost</StyledLabel>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            type="email"
            id="email"
            placeholder="navn@eksempel.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></StyledInput>
          <Button type="submit">Legg til</Button>
        </StyledLabelInputPair>
      </form>

      <div className="mt-20 mb-32">
        <StyledLabel>Inviterte brukere</StyledLabel>
        {invites.length > 0 ? (
          <ul className="list-disc pl-20">
            {invites.map((email: string) => {
              return <li key={email}>{email}</li>;
            })}
          </ul>
        ) : (
          <p className="opacity-75">Ingen brukere lagt til</p>
        )}
      </div>
      <Button onClick={handleAddGroup} disabled={!groupName.trim()}>
        Lagre gruppe
      </Button>
    </Container>
  );
};
