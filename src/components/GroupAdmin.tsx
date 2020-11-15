import React, { useState } from "react";
import { Container } from "./common/Container";

import { BorderButton, Button } from "./common/Button";
import { Link } from "./common/Link";
import { Spacer } from "./common/Spacer";
import { useKohort } from "../hooks/useKohort";
import { useUser } from "../hooks/useUser";
import { Kohort } from "../types/types";
import { StyledBigHeader } from "./common/StyledHeading";
import { StyledLabel } from "./common/Label";
import { StyledInput } from "./common/StyledInput";
import { StyledLabelInputPair } from "./common/StyledLabelInputPair";
import firebase from "./firebase/firebase";
import { mutate } from "swr";
import { useParams } from "react-router";

export const GroupAdmin = ({ myUid }: { myUid: string }) => {
  const [newInvite, setNewInvite] = useState("");
  const [newUid, setNewUid] = useState("");
  const { kohortId } = useParams<{ kohortId: string }>();
  const { kohort } = useKohort(kohortId);

  if (kohort?.admin !== myUid) return null;

  function emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleAddUid(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        members: [...(kohort?.members || []), newUid],
      });

    // TODO notification

    setNewUid("");
  }

  async function handleAddEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inviteRef = firebase.firestore().collection("invites").doc(newInvite);

    const inviteData = await inviteRef.get();
    const set = new Set(inviteData.data()?.myInvites);
    set.add(kohort?.id);

    await inviteRef.set({
      myInvites: Array.from(set),
    });

    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        invites: [...(kohort?.invites || []), newInvite],
      });

    setNewInvite("");
    mutate(["groups", kohort?.id]);
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Administrer kohort {kohort.groupName}</StyledBigHeader>
      <h3>Invitasjoner</h3>
      {kohort.invites.map((invite) => {
        return <div>{invite}</div>;
      })}
      <Spacer />
      <h3>Legg til ny invitasjon</h3>
      <form onSubmit={handleAddEmail}>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            id="email"
            value={newInvite}
            onChange={(e) => setNewInvite(e.target.value)}
          ></StyledInput>
          <Button disabled={!emailIsValid(newInvite)} type="submit">
            Legg til
          </Button>
        </StyledLabelInputPair>
      </form>
      <Spacer />
      <h3>Legg til bruker med ID</h3>
      <form onSubmit={handleAddUid}>
        <StyledLabel htmlFor="email">Bruker-ID</StyledLabel>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            id="uid"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
          ></StyledInput>
          <Button disabled={newUid === ""} type="submit">
            Legg til
          </Button>
        </StyledLabelInputPair>
      </form>
      <Spacer />
      <Link to="/settings">Tilbake til innstillinger</Link>
    </Container>
  );
};
