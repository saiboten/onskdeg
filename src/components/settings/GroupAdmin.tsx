import React, { useState } from "react";
import { Container } from "../common/Container";

import { Button } from "../common/Button";
import { Link } from "../common/Link";
import { Spacer } from "../common/Spacer";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { Kohort } from "../../types/types";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import { useParams } from "react-router";
import styled from "styled-components";
import Loading from "../common/Loading";
import { AddUserByUid } from "./AddUserByUid";
import { AddInvite } from "./AddInvite";

const StyledRow = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MiniButton = styled.button`
  background: 0;
  outline: none;
  border: none;
  display: inline;
  color: ${(props) => props.theme.white};
  cursor: pointer;
`;

const KohortMember = ({
  kohort,
  kohortId,
  myUid,
  uid,
}: {
  kohort: Kohort;
  kohortId: string;
  myUid: string;
  uid: string;
}) => {
  const { user } = useUser(uid);
  const [showUid, setShowUid] = useState(false);

  function handleRemoveUser() {
    firebase
      .firestore()
      .collection("groups")
      .doc(kohortId)
      .update({
        members: kohort?.members.filter((memberId) => memberId !== uid) ?? [],
      });
    mutate(["groups", kohortId]);
  }

  return (
    <StyledRow>
      <div
        style={{
          flex: "1",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          hyphens: "auto",
        }}
      >
        {user?.name || "Ukent bruker"} (
        {showUid ? (
          uid
        ) : (
          <MiniButton onClick={() => setShowUid(true)}>Vis ID</MiniButton>
        )}
        )
      </div>
      {myUid !== uid ? (
        <Button onClick={handleRemoveUser}>Fjern bruker</Button>
      ) : (
        <div>Administrator</div>
      )}
    </StyledRow>
  );
};

const KohortInvite = ({
  kohort,
  kohortId,
  invite,
}: {
  kohort: Kohort;
  kohortId: string;
  invite: string;
}) => {
  const [removeInviteLoading, setRemoveInviteLoading] = useState(false);
  async function handleRemoveInvite() {
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        invites: kohort?.invites.filter((m) => m !== invite) ?? [],
      });

    setRemoveInviteLoading(true);
    const docRef = firebase.firestore().collection("invites").doc(invite);

    const inviteData = await docRef.get();

    await docRef.update({
      myInvites:
        inviteData.data()?.myInvites.filter((m: string) => m !== kohortId) ||
        [],
    });
    mutate(["groups", kohortId]);
    setRemoveInviteLoading(false);
  }

  return (
    <StyledRow>
      {invite}
      {removeInviteLoading ? (
        <Loading />
      ) : (
        <Button onClick={handleRemoveInvite}>Fjern invitasjon</Button>
      )}
    </StyledRow>
  );
};

export const GroupAdmin = ({ myUid }: { myUid: string }) => {
  const { kohortId } = useParams<{ kohortId: string }>();
  const { kohort } = useKohort(kohortId);
  const { user } = useUser(myUid);

  if (kohort?.admin !== myUid) return null;

  return (
    <Container textLeft>
      <StyledBigHeader>Administrer kohort {kohort.groupName}</StyledBigHeader>
      <StyledSubHeader>Invitasjoner</StyledSubHeader>
      {kohort.invites.map((invite) => {
        return (
          <KohortInvite
            key={invite}
            kohort={kohort}
            kohortId={kohortId}
            invite={invite}
          />
        );
      })}
      <Spacer />
      <StyledSubHeader>Medlemmer</StyledSubHeader>
      {kohort.members.map((member) => {
        return (
          <KohortMember
            kohort={kohort}
            kohortId={kohortId}
            myUid={myUid}
            uid={member}
          />
        );
      })}
      <Spacer />
      <AddInvite kohort={kohort} kohortId={kohortId} user={user} />
      <Spacer />
      <AddUserByUid kohort={kohort} kohortId={kohortId} />
      <Spacer />
      <Link to="/settings">Tilbake til innstillinger</Link>
    </Container>
  );
};
