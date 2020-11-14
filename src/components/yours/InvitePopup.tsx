import React, { useState } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { BorderButton } from "../common/Button";
import { Spacer } from "../common/Spacer";
import firebase from "../firebase/firebase";

interface Props {
  invites: string[];
  uid: string;
}

const StyledBlurredBackground = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  transition: all 1s;

  @supports (-webkit-backdrop-filter: blur(10px)) or
    (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
`;

const StyledInnerContent = styled.div`
  width: 50%;
  height: 50%;
  background: #000;
  color: #fff;
  box-shadow: 0 2rem 4rem rgba(#000, 0.2);
  border-radius: 3px;
  overflow: hidden;
  opacity: 1;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.6s 0.25s;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 450px) {
    width: 100%;
    height: 80%;
  }
`;

const StyledButton = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const InvitePopup = ({ invites, uid }: Props) => {
  const firstInvite = invites[0];

  const { kohort } = useKohort(firstInvite);
  const { user } = useUser(uid);

  async function joinGroup() {
    // Remove invite
    await firebase
      .firestore()
      .collection("invites")
      .doc(user?.email || "")
      .update({
        myInvites: invites.filter((m) => m !== firstInvite),
      });

    // Join group
    await firebase
      .firestore()
      .collection("groups")
      .doc(firstInvite)
      .update({
        users: [...(kohort?.users || []), ...(user?.childs || []), uid],
      });

    mutate(["invites", user?.email]);
  }

  async function declineGroupInvite() {
    // todo decline
    await firebase
      .firestore()
      .collection("invites")
      .doc(user?.email || "")
      .update({
        myInvites: invites.filter((m) => m !== firstInvite),
      });
    mutate(["invites", user?.email]);
  }

  return (
    <StyledBlurredBackground>
      <StyledInnerContent>
        <Spacer />
        <h1>
          Du er invitert til en kohort med navn:{" "}
          <strong>{kohort?.groupName}</strong>
        </h1>
        <Spacer />

        <p>
          Hvis du takker nei til invitasjonen må du få en ny invitasjon av
          eieren av kohorten.
        </p>

        <p>Her kommer en liste med de som er med fra før.</p>

        <p>Vil du være med?</p>
        <StyledButton>
          <BorderButton
            style={{ marginRight: "1rem" }}
            onClick={declineGroupInvite}
          >
            Niks
          </BorderButton>
          <BorderButton onClick={joinGroup}>OK</BorderButton>
        </StyledButton>
      </StyledInnerContent>
    </StyledBlurredBackground>
  );
};
