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

const GroupAdmin = ({
  myUid,
  kohort,
}: {
  myUid: string;
  kohort: Kohort | undefined;
}) => {
  const [newInvite, setNewInvite] = useState("");

  if (kohort?.admin !== myUid) return null;

  function emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <div>
      <StyledBigHeader>Administrer kohort {kohort.groupName}</StyledBigHeader>
      <h3>Invitasjoner</h3>
      {kohort.invites.map((invite) => {
        return <div>{invite}</div>;
      })}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const inviteRef = firebase
            .firestore()
            .collection("invites")
            .doc(newInvite);

          const inviteData = await inviteRef.get();
          const set = new Set(inviteData.data()?.myInvites);
          set.add(kohort.id);

          await inviteRef.set({
            myInvites: Array.from(set),
          });

          await firebase
            .firestore()
            .collection("groups")
            .doc(kohort.id)
            .update({
              invites: [...kohort.invites, newInvite],
            });

          setNewInvite("");
          mutate(["groups", kohort.id]);
        }}
      >
        <StyledLabel htmlFor="email">Epost</StyledLabel>
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
    </div>
  );
};

const GroupSetting = ({
  myUid,
  group: groupId,
}: {
  myUid: string;
  group: string;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <>
      <GroupAdmin myUid={myUid} kohort={kohort} />
      <Spacer />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Du er med i {kohort?.groupName}. <Button>Forlate gruppen?</Button>
      </div>
    </>
  );
};

interface Props {
  uid: string;
}

export const Settings = ({ uid }: Props) => {
  const { user } = useUser(uid);

  return (
    <Container textLeft>
      <h1>Innstillinger</h1>
      <Spacer />
      <BorderButton>
        <Link to={`/addgroup`}>Opprett ny kohort</Link>
      </BorderButton>
      {user?.groups.map((group) => (
        <React.Fragment key={group}>
          <GroupSetting myUid={uid} group={group} />
          <Spacer />
        </React.Fragment>
      ))}
    </Container>
  );
};
