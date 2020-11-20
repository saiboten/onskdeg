import React, { useState } from "react";
import { Container } from "./common/Container";

import { BorderButton, Button } from "./common/Button";
import { Link } from "./common/Link";
import { Spacer } from "./common/Spacer";
import { useKohort } from "../hooks/useKohort";
import { useUser } from "../hooks/useUser";
import { Kohort } from "../types/types";
import { StyledBigHeader, StyledSubHeader } from "./common/StyledHeading";
import { StyledLabel } from "./common/Label";
import { StyledInput } from "./common/StyledInput";
import { StyledLabelInputPair } from "./common/StyledLabelInputPair";
import firebase from "./firebase/firebase";
import { mutate } from "swr";
import { useParams } from "react-router";
import styled from "styled-components";

const StyledRow = styled.div`
  margin-bottom: 1rem;
  max-width: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KohortMember = ({ myUid, uid }: { myUid: string; uid: string }) => {
  const { user } = useUser(uid);

  return (
    <StyledRow>
      {user?.name || "Ukent bruker"}

      {myUid !== uid ? (
        <Button>Fjern bruker fra gruppen</Button>
      ) : (
        <div>Administrator</div>
      )}
    </StyledRow>
  );
};

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
      <StyledSubHeader>Invitasjoner</StyledSubHeader>
      {kohort.invites.map((invite) => {
        async function handleRemoveInvite() {
          firebase
            .firestore()
            .collection("groups")
            .doc(kohort?.id)
            .update({
              invites: kohort?.invites.filter((m) => m !== invite) || [],
            });
          mutate(["groups", kohortId]);
        }

        return (
          <StyledRow>
            {invite}
            <Button onClick={handleRemoveInvite}>Fjern invitasjon</Button>
          </StyledRow>
        );
      })}
      <Spacer />
      <StyledSubHeader>Medlemmer</StyledSubHeader>
      {kohort.members.map((member) => {
        return <KohortMember myUid={myUid} uid={member} />;
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
